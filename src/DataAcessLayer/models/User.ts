import { BuildOptions, Model, DataTypes, Sequelize } from "sequelize";
import { IUser } from "../../BusinessLayer/models/User";
import { MESSAGE } from "../../ApplicationUtility/constant/message";

export interface UserModel extends Model<IUser>, IUser {}
export class User extends Model<UserModel, IUser> {}
export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define("users", { 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: MESSAGE.VALIDATION.EMAIL_EXIST,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    mobile: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    countryCode: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deviceId: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    deviceToken: {
      type: new DataTypes.STRING(255),
      allowNull: true
    },
    platform: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1 for android, 2 for ios, 3 for web'
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: new DataTypes.SMALLINT(),
      defaultValue: 1,
      comment: '1 for active, 2 for deactive, 3 for delete'
    },
    address: {
      type: new DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: new DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: new DataTypes.STRING,
      allowNull: true
    },
    zip: {
      type: new DataTypes.STRING,
      allowNull: true
    },
    passwordResetToken: {
      type: new DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}
