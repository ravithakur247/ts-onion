import * as dotenv from "dotenv";
dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../.env`;
    break;
  default:
    path = `${__dirname}/../.env.development`;
}

export const envPath = path;
