import * as jwt from "jsonwebtoken";
import { globalConfig } from "../constant/globalConstant";
import { IUser } from "../../BusinessLayer/models/User";

export function generateLoginToken(user: IUser) {
  return jwt.sign(
    {
      data: {
        id: user.id,
        role: user.role,
      },
    },
    globalConfig.JWT_SECRET,
    { expiresIn: globalConfig.JWT_LIFE }
  );
}

export function generateForgetPwdToken(token: string) {
  return jwt.sign(
    {
      data: { token },
    },
    globalConfig.JWT_SECRET,
    { expiresIn: globalConfig.JWT_FORGET_PASSWORD_LIFE }
  );
}
