import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { Response } from "express";
import { HTTPSTATUS } from "../constant/httpStatus";
import BadRequestException from "./badRequest";

type Constructor<T> = { new (): T };
export async function validatorForModel<T>(
  res: Response,
  type: Constructor<T>,
  model: any
): Promise<void> {
  let input = plainToClass(type, model);
  let errors: ValidationError[] = await validate(input);
  let RequestError;
  if (errors.length > 0) {
    RequestError = errors.map((error: ValidationError) => {
      let keys = Object.keys(error.constraints || {});
      let erroObj = error.constraints || {};
      return { [error.property]: erroObj[keys[0]] };
    });
  }

  if (errors.length > 0) {
    return Promise.reject({
      code: HTTPSTATUS.BAD_REQUEST,
      errors: RequestError,
      message: null,
    });
  }
}
