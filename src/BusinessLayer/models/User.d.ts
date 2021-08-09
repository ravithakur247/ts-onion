import { UserModel } from "../../DataAcessLayer/models/User";

export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  mobile: string;
  countryCode: string;
  isEmailVerified: boolean;
  deviceId: string;
  deviceToken: string;
  platform: string;
  role: number;
  isMobileVerified: boolean;
  status: number;
  address: string;
  country: string;
  city: string;
  zip: string;
  passwordResetToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode?: string;
  mobile?: string;
  isEmailVerified: boolean;
  isMobileVerified?: boolean;
  profileImage: string;
  role: number;
  platform: number;
  status: number;
}

export interface ICreateSubadmin extends ICreateUser {} 

export interface ICreateSuperadmin extends ICreateUser {} 

export interface IAuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  profileImage: string;
}

export interface ILogin {
  email: string;
  password: string;
  ip: string | undefined;
  userAgent: string | undefined;
}

export interface ILoginResponse {
  token: string;
  user: IAuthUser
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPlayload {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  profileImage: string;
}

export interface IList {
  pageNo: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  attrebutes?: string[];
}

export interface IUserListingQuery extends IList {
  role: number
}