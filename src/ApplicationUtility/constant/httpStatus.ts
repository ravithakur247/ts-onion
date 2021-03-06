export enum HTTPSTATUS {
    SUCCESS = 200,
    SUCCESS_CREATE = 201,
    SUCCESS_UPDATE = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    NOT_ALLOWED = 405,
    CONFLICT = 409,
    PRECONDITION_FAILED = 412,
    UNPROCESSABLE_ENTITY = 422,
    RATE_LIMIT_EXCEEDED = 429,
    INTERNAL_ERROR = 500,
  }