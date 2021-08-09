import * as Sequelize from "sequelize";
import { DbInterface } from "./typings";
import { UserFactory } from "./models/User";
import { config } from "./config/sequelizeConfig";
import {
  APPLICATION_ROLE,
  USERSTATUS,
  PLATFORM,
} from "../ApplicationUtility/enums";
import * as argon2 from "argon2";

const dbConfig = new Sequelize.Sequelize(
  `${config.params.dialect}://${config.username}:${config.password}@${config.params.host}:${config.params.port}/${config.database}`
);
export async function connectDB() {
  try {
    await dbConfig.sync({ alter: true });
    console.log(`connected to database`);

    // create superadmin
    await UserFactory(dbConfig).findOrCreate({
      where: {
        role: APPLICATION_ROLE.SUPER_ADMIN,
      },
      defaults: {
        firstName: "Super",
        lastName: "admin",
        email: "super-admin@yopmail.com",
        role: APPLICATION_ROLE.SUPER_ADMIN,
        password: await argon2.hash("Admin@123"),
        status: USERSTATUS.ACTIVE,
        isEmailVerified: true,
        profileImage:
          "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
        platform: PLATFORM.WEB,
      },
    });
  } catch (exception) {
    console.log(`unable to connect database`, exception);
  }
}
export const db: DbInterface = {
  User: UserFactory(dbConfig),
};
