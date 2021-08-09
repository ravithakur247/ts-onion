import {
  IsEmail,
  validate,
  IsString,
  ValidationError,
  IsDate,
  IsNumber,
  IsOptional,
  Max,
  Min,
  Length,
  Matches,
  IsEmpty,
  Allow,
  IsDefined,
} from "class-validator";
import { MESSAGE } from "../../../../ApplicationUtility/constant/message";

export class Email {
  @IsString()
  @IsEmail(undefined, {
    message: MESSAGE.VALIDATION.INVALID_EMAIL
  })
  email: string | undefined;
}

export class Password {
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,20}$/, { message: MESSAGE.VALIDATION.WEAK_PASSWORD})
  password: string | undefined;
}

export class UserCreatePayload extends Email {
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,20}$/, { message: MESSAGE.VALIDATION.WEAK_PASSWORD})
  password: string | undefined;
  @IsString()
  @Length(1, 128)
  firstName: string | undefined;
  @IsString()
  @Length(1, 128)
  lastName: string | undefined;
  @IsString()
  @IsOptional()
  @Max(256)
  profileImage: string | undefined;//Joi.string().trim().optional().min(2).max(200),
  @IsString()
  @IsOptional()
  @Length(9, 12)
  mobile: string | undefined;//Joi.number().min(9).max(12).optional(),
  @IsString()
  @IsOptional()
  @Length(1, 4)
  countryCode: string | undefined;//Joi.string().min(1).max(4).optional()
}

export class SubadminCreatePayload extends UserCreatePayload {}

export class UserSignInModel extends Email {
  @IsString()
  password: string | undefined;
}

export class ResetPasswordPayload extends Password {
  @IsString()
  token: string | undefined;
}

export class ChangePasswordPayload {
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,20}$/, { message: MESSAGE.VALIDATION.WEAK_PASSWORD})
  oldPassword: string | undefined;
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,20}$/, { message: MESSAGE.VALIDATION.WEAK_PASSWORD})
  newPassword: string | undefined;
}

export class UpdateProfilePayload {
  @IsString()
  @Length(1, 128)
  firstName: string | undefined;
  @IsString()
  @Length(1, 128)
  lastName: string | undefined;
  @Length(0, 256)
  @IsOptional()
  profileImage: string | undefined;
}