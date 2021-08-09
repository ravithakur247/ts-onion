import { injectable } from "inversify";
import { IUserService } from "../interfaces/IUserService";
import { db } from "../../DataAcessLayer";
import { HTTPSTATUS } from "../../ApplicationUtility/constant/httpStatus";
import { MESSAGE } from "../../ApplicationUtility/constant/message";
import * as argon2 from "argon2";
import {
  ICreateSubadmin,
  IUser,
  ILogin,
  ILoginResponse,
  IAuthUser,
  ResetPasswordPayload,
  ChangePasswordPlayload,
  IUpdateProfilePayload,
} from "../models/User";
import { USERSTATUS } from "../../ApplicationUtility/enums";
import {
  generateForgetPwdToken,
  generateLoginToken,
} from "../../ApplicationUtility/helper/jwtHelper";
import { generateRandomString } from "../../ApplicationUtility/helper/universalHelper";
import { globalConfig } from "../../ApplicationUtility/constant/globalConstant";
import { TemplateUtil } from "../../ApplicationUtility/helper/TemplateUtil";
import { MailManager } from "../../ApplicationUtility/helper/MailManager";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../../DataAcessLayer/models/User";

@injectable()
export class UserService implements IUserService {
  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    payload;
    try {
      const { data } = <any>jwt.verify(payload.token, globalConfig.JWT_SECRET);

      const account = await db.User.findOne({
        attributes: ["id"],
        where: {
          passwordResetToken: data.token,
        },
      });

      if (!account) {
        return Promise.reject({
          message: MESSAGE.USER.FORGET_PASSWORD_TOKEN_INVALID,
          code: HTTPSTATUS.BAD_REQUEST,
        });
      }

      account.passwordResetToken = "";
      account.password = await argon2.hash(payload.password);

      await account.save();
    } catch (e) {
      return Promise.reject({
        message: e.message,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }
  async createUser(payload: ICreateSubadmin): Promise<IUser> {
    try {
      (payload.password = await argon2.hash(payload.password)),
        (payload.email = payload.email.toLowerCase());

      return await db.User.create(payload);
    } catch (e) {
      return Promise.reject({
        message: e.message || MESSAGE.USER.CREATION.FAILURE,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async login(payload: ILogin): Promise<ILoginResponse> {
    try {
      const account = await db.User.findOne({
        attributes: [
          "id",
          "role",
          "email",
          "firstName",
          "lastName",
          "password",
          "profileImage",
          "status",
        ],
        where: { email: payload.email.toLowerCase() },
      });

      if (account) {
        if (await argon2.verify(account.password, payload.password)) {
          if (account.status !== USERSTATUS.ACTIVE) {
            return Promise.reject({
              message: MESSAGE.USER.LOGIN.BLOCKED,
              code: HTTPSTATUS.UNAUTHORIZED,
            });
          }

          const user: IAuthUser = {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            role: account.role,
            profileImage: account.profileImage,
          };
          return { token: generateLoginToken(account), user };
        } else {
          return Promise.reject({
            message: MESSAGE.USER.LOGIN.FAILURE,
            code: HTTPSTATUS.UNAUTHORIZED,
          });
        }
      } else {
        return Promise.reject({
          message: MESSAGE.USER.LOGIN.FAILURE,
          code: HTTPSTATUS.UNAUTHORIZED,
        });
      }
    } catch (e) {
      return Promise.reject({
        message: e.message || MESSAGE.USER.LOGIN.FAILURE,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async forgetPassword(email: string): Promise<void> {
    try {
      const account = await db.User.findOne({
        attributes: ["id", "firstName"],
        where: {
          email: email,
          status: USERSTATUS.ACTIVE,
        },
      });

      if (account) {
        const passwordResetToken = generateRandomString(10);
        const token = generateForgetPwdToken(passwordResetToken);
        const url = `${globalConfig.ADMIN_HOST}/account/reset-password/${token}`;
        const template = await new TemplateUtil(
          process.cwd() +
            "/src/ApplicationLayer/views/email/" +
            "forgot_password.html"
        ).compileFile({ url, name: account.firstName });
        new MailManager(email, MESSAGE.MAIL_SUBJECT.FORGET_PASSWORD, template);
        await db.User.update(
          {
            passwordResetToken,
          },
          {
            where: {
              id: account.id,
            },
          }
        );
      }
    } catch (e) {
      return Promise.reject({
        message: e.message,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async getAccountById(id: number, attrebutes?: string[]): Promise<UserModel> {
    const account = await db.User.findOne({
      attributes: attrebutes ? attrebutes : undefined,
      where: { id },
    });

    if (!account) {
      return Promise.reject({
        message: MESSAGE.USER.NOT_EXIST,
        code: HTTPSTATUS.NOT_FOUND,
      });
    }

    return account;
  }

  async changePassword(payload: ChangePasswordPlayload): Promise<void> {
    try {
      const account = await this.getAccountById(payload.id);
      if (await argon2.verify(account.password, payload.oldPassword)) {
        account.password = await argon2.hash(payload.newPassword);
        await account.save();
      } else {
        return Promise.reject({
          message: MESSAGE.USER.OLD_PASSWORD_INCORRECT,
          code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
        });
      }
    } catch (e) {
      return Promise.reject({
        message: e.message,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async updateProfile(
    id: number,
    payload: IUpdateProfilePayload
  ): Promise<void> {
    const account = await this.getAccountById(id);
    account.firstName = payload.firstName;
    account.lastName = payload.lastName;
    account.profileImage = payload.profileImage ? payload.profileImage : "";

    try {
      await account.save();
    } catch (e) {
      return Promise.reject({
        message: e.message,
        code: HTTPSTATUS.UNPROCESSABLE_ENTITY,
      });
    }
  }
}
