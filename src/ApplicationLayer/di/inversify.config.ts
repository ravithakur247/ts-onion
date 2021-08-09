import { TYPES, MIDDLEWARETYPES } from "./types";

import { Container } from "inversify";
import { UserService } from "../../BusinessLayer/services/userService";
import { IUserService } from "../../BusinessLayer/interfaces/IUserService";
import { AuthMiddleware, AuthSuperadminMiddleware } from "../middleware/auth.middleware";

const container = new Container();
//register middlewares
container.bind<AuthMiddleware>(MIDDLEWARETYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
container.bind<AuthSuperadminMiddleware>(MIDDLEWARETYPES.AuthSuperadminMiddleware).to(AuthSuperadminMiddleware).inSingletonScope();

//register services
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
export default container;
