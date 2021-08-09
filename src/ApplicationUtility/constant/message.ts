export const MESSAGE = {
  SUCCESS: "Success",
  INTERNAL_SERVER_ERROR: "Oops!! something went wrong.",
  INVALID_TOKEN: "Invlid token.",
  SESSION_EXPIRED: "Session expired",
  ACCESS_DENIED: "Access denied!",
  TOKEN_NOT_FOUND: "Token not found.",
  USER: {
    CREATION: {
      SUCEESS: "User created successfully.",
      EMAIL_ALREADY_USED: "Email already used.",
      FAILURE: "User cannot be created.",
    },
    FETCH: {
      SUCCESS: "users fetched successfully.",
    },
    LOGIN: {
      SUCCESS: "logged in successfully.",
      FAILURE: "Email or password is wrong.",
      BLOCKED: "Your account was blocked"
    },
    NOT_EXIST: "User is not registered",
    RESET_PASSWORD_SUCCESS: "Password reset success",
    FORGET_PASSWORD: "Reset email has been sent to registered email",
    FORGET_PASSWORD_TOKEN_INVALID: "Token is invalid",
    OLD_PASSWORD_INCORRECT: "Old password is incorrect",
    DEACTIVTED: "Your account has been blocked",
    PROFILE_UPDATED: "Profile has been updated successfully"
  },
  VALIDATION: {
    WEAK_PASSWORD: 'Password should contain alphnumeric having at least 1 uppercase and 1 lowercase characters',
    INVALID_EMAIL: 'Please enter a valid email',
    EMAIL_EXIST: 'Email address already in use!'
  },
  MAIL_SUBJECT: {
    FORGET_PASSWORD: 'Your request for reset password!'
  }
};
