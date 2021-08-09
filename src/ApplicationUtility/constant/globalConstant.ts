export const globalConfig = Object.freeze({
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_LIFE: process.env.JWT_LIFE || "",
  JWT_FORGET_PASSWORD_LIFE: process.env.JWT_FORGET_PASSWORD_LIFE,
  ADMIN_HOST: process.env.ADMIN_HOST,
  EMAIL: {
    PROVIDER: process.env.EMAIL_PROVIDER,
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    FROM: process.env.EMAIL_FROM
  }
}); 
