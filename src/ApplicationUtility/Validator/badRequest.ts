import { HTTPSTATUS } from "../constant/httpStatus";
import { CustomError } from "ts-custom-error";

class BadRequestException extends CustomError {
  constructor(
    public errorMessage: any,
    public status: number = HTTPSTATUS.BAD_REQUEST,
    public message: string = ""
  ) {
    super(message);
  }
}

export default BadRequestException;
