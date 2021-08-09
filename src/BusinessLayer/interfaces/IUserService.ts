import { ICreateSubadmin, IUser, ILogin, ILoginResponse, ResetPasswordPayload, IUpdateProfilePayload } from "../models/User";
import { IServiceException } from "../models/Exception";
import { ChangePasswordPayload } from "../../ApplicationLayer/middleware/requestValidators/user.controller.validators/user.validator";
import { UserModel } from "../../DataAcessLayer/models/User";

export interface IUserService {
  login(payload: ILogin): Promise<ILoginResponse>;
  createUser(payload: ICreateSubadmin): Promise<IUser | IServiceException>;
  forgetPassword(email: string): Promise<void>;
  resetPassword(payload: ResetPasswordPayload): Promise<void>;
  changePassword(payload: ChangePasswordPayload): Promise<void>;
  getAccountById(id: number, attributes?: string[]): Promise<UserModel>;
  updateProfile(id: number, payload: IUpdateProfilePayload): Promise<void>
}
