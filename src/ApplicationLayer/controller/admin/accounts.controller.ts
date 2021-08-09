"use strict";

import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpPost,
  httpPut,
  httpGet,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES, MIDDLEWARETYPES } from "../../di/types";
import { IUserService } from "../../../BusinessLayer/interfaces/IUserService";
import {
  UserSignInModel,
  Email,
  ResetPasswordPayload,
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "../../middleware/requestValidators/user.controller.validators/user.validator";
import { validatorForModel } from "../../../ApplicationUtility/Validator/validatorErrorHandler";
import { HTTPSTATUS } from "../../../ApplicationUtility/constant/httpStatus";
import {
  sendSuccess,
  sendError,
} from "../../../ApplicationUtility/response.model";
import { ILogin, IAuthUser } from "../../../BusinessLayer/models/User";
import { MESSAGE } from "../../../ApplicationUtility/constant/message";
import {
  ApiPath,
  ApiOperationPost,
  SwaggerDefinitionConstant,
  ApiOperationPut,
  ApiOperationGet,
} from "swagger-express-ts";
import { ADMIN_BASE } from "../../../ApplicationUtility/constant/routes";

@ApiPath({
  path: ADMIN_BASE,
  name: "Admin base",
})
@controller(ADMIN_BASE)
export class AccountsController implements interfaces.Controller {
  private _userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    this._userService = userService;
  }

  @ApiOperationPost({
    path: "/login",
    description: "Web login",
    summary: "Post web login",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.STRING, required: true },
        },
      },
    },
    responses: {},
  })
  @httpPost("/login")
  public async login(req: Request, res: Response) {
    try {
      const payload: ILogin = req.body;
      await validatorForModel(res, UserSignInModel, payload);
      payload.ip = req.get("User-Agent");
      payload.userAgent = req.connection.remoteAddress;

      const login = await this._userService.login(payload);
      sendSuccess(res, HTTPSTATUS.SUCCESS, login);
    } catch (e) {
      sendError(res, e.code, e.message, e.errors);
    }
  }

  @ApiOperationPost({
    path: "/forgot-password",
    description: "Forget password pre login",
    summary:
      "This will send reset password mail to the user with reset password token",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.STRING, required: true },
        },
      },
    },
    responses: {},
  })
  @httpPost("/forgot-password")
  public async forgetPassword(req: Request, res: Response) {
    try {
      await validatorForModel(res, Email, req.body);
      await this._userService.forgetPassword(req.body.email);
      sendSuccess(res, HTTPSTATUS.SUCCESS, MESSAGE.USER.FORGET_PASSWORD);
    } catch (e) {
      sendError(res, e.code, e.message, e.errors);
    }
  }

  @ApiOperationPut({
    path: "/reset-password",
    description: "Reset password",
    summary:
      "Called after forget password api to reset password. Here we verify token",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.STRING, required: true },
        },
      },
    },
    responses: {},
  })
  @httpPut("/reset-password")
  public async resetPassword(req: Request, res: Response) {
    try {
      await validatorForModel(res, ResetPasswordPayload, req.body);
      await this._userService.resetPassword(req.body);
      sendSuccess(res, HTTPSTATUS.SUCCESS, MESSAGE.USER.RESET_PASSWORD_SUCCESS);
    } catch (e) {
     
      sendError(res, e.code, e.message, e.errors);
    }
  }

  @ApiOperationPut({
    path: "/change-password",
    description: "Change password",
    summary: "Change password api for admin post login",
    parameters: {
      body: {
        properties: {
          oldPassword: {
            type: SwaggerDefinitionConstant.STRING,
            required: true,
          },
          newPassword: {
            type: SwaggerDefinitionConstant.STRING,
            required: true,
          },
        },
      },
    },
    responses: {},
    security: {
      BearerToken: [],
    },
  })
  @httpPut("/change-password", MIDDLEWARETYPES.AuthMiddleware)
  public async changePassword(req: Request, res: Response) {
    try {
      await validatorForModel(res, ChangePasswordPayload, req.body);
      req.body.id = res.locals.authUser.id;
      await this._userService.changePassword(req.body);
      sendSuccess(
        res,
        HTTPSTATUS.SUCCESS,
        null,
        MESSAGE.USER.RESET_PASSWORD_SUCCESS
      );
    } catch (e) {
      sendError(res, e.code, e.message, e.errors);
    }
  }

  @ApiOperationGet({
    path: "/profile",
    description: "User profile",
    summary: "Get basic user profile details",
    parameters: {},
    responses: {},
    security: {
      BearerToken: [],
    },
  })
  @httpGet("/profile", MIDDLEWARETYPES.AuthMiddleware)
  public async userProfile(req: Request, res: Response) {
    try {
      const account = await this._userService.getAccountById(
        res.locals.authUser.id
      );
      sendSuccess(
        res,
        HTTPSTATUS.SUCCESS,
        {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          profileImage: account.profileImage,
        } as IAuthUser,
        ""
      );
    } catch (e) {
      sendError(res, e.code, e.message, e.errors);
    }
  }

  @ApiOperationPut({
    path: "/profile",
    description: "Update user profile",
    summary: "Api to update basic details of user",
    parameters: {
      body: {
        properties: {
          firstName: { type: SwaggerDefinitionConstant.STRING, required: true },
          lastName: { type: SwaggerDefinitionConstant.STRING, required: true },
          profileImage: {
            type: SwaggerDefinitionConstant.STRING,
            required: false,
          },
        },
      },
    },
    responses: {},
    security: {
      BearerToken: [],
    },
  })
  @httpPut("/profile", MIDDLEWARETYPES.AuthMiddleware)
  public async updateUserProfile(req: Request, res: Response) {
    try {
      await validatorForModel(res, UpdateProfilePayload, req.body);
      await this._userService.updateProfile(res.locals.authUser.id, req.body);
      sendSuccess(res, HTTPSTATUS.SUCCESS, null, MESSAGE.USER.PROFILE_UPDATED);
    } catch (e) {
      sendError(res, e.code, e.message, e.errors);
    }
  }
}
