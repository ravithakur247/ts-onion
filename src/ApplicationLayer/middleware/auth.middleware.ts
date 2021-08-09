import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { HTTPSTATUS } from "../../ApplicationUtility/constant/httpStatus";
import { MESSAGE } from "../../ApplicationUtility/constant/message";
import { globalConfig } from "../../ApplicationUtility/constant/globalConstant";
import { IAuthUser } from "../../BusinessLayer/models/User";
import { sendError } from "../../ApplicationUtility/response.model";
import { APPLICATION_ROLE, USERSTATUS } from "../../ApplicationUtility/enums";
import { db } from "../../DataAcessLayer";

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const authorizationHeaader = req.headers.authorization as string;
    if (authorizationHeaader) {
      try {
        const token = authorizationHeaader.split(" ")[1];
        const { data } = <any>jwt.verify(token, globalConfig.JWT_SECRET);

        db.User.findOne({
          where: {
            id: data.id,
            status: [USERSTATUS.ACTIVE, USERSTATUS.DEACTIVE],
          },
        }).then((account) => {
          if (!account) {
            return sendError(
              res,
              HTTPSTATUS.UNAUTHORIZED,
              MESSAGE.USER.NOT_EXIST
            );
          }

          if (account?.status === USERSTATUS.DEACTIVE) {
            return sendError(
              res,
              HTTPSTATUS.UNAUTHORIZED,
              MESSAGE.USER.DEACTIVTED
            );
          }

          res.locals.authUser = account as IAuthUser;
          next();
        });
      } catch (err) {
        return sendError(res, HTTPSTATUS.UNAUTHORIZED, MESSAGE.SESSION_EXPIRED);
      }
    } else {
      return sendError(res, HTTPSTATUS.UNAUTHORIZED, MESSAGE.TOKEN_NOT_FOUND);
    }
  }
}
