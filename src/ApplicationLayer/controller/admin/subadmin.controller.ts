"use strict";

import { Request, Response } from "express";
import {
  interfaces,
  controller,
  httpPost
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES, MIDDLEWARETYPES } from "../../di/types";
import { IUserService } from "../../../BusinessLayer/interfaces/IUserService";
import {
  SubadminCreatePayload,
} from "../../middleware/requestValidators/user.controller.validators/user.validator";
import { validatorForModel } from "../../../ApplicationUtility/Validator/validatorErrorHandler";
import { HTTPSTATUS } from "../../../ApplicationUtility/constant/httpStatus";
import { APPLICATION_ROLE, PLATFORM } from "../../../ApplicationUtility/enums";
import { sendSuccess, sendError } from "../../../ApplicationUtility/response.model";
import { MESSAGE } from "../../../ApplicationUtility/constant/message";
import { ICreateSubadmin } from "../../../BusinessLayer/models/User";
import { ApiPath, ApiOperationPost, SwaggerDefinitionConstant } from "swagger-express-ts";
import { ADMIN_SUBADMINS } from "../../../ApplicationUtility/constant/routes";

@ApiPath({
  path: ADMIN_SUBADMINS,
  name: "Subadmins"
})
@controller(ADMIN_SUBADMINS)
export class SubadminController implements interfaces.Controller {
  private _userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    this._userService = userService;
  }

  @ApiOperationPost({
    path: "/",
    description: "Create subadmin",
    summary: "A subadmin can be created by a superadmin",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.STRING, required: true },
          firstName: { type: SwaggerDefinitionConstant.STRING, required: true },
          lastName: { type: SwaggerDefinitionConstant.STRING, required: true },
          profileImage: { type: SwaggerDefinitionConstant.STRING, required: false },
          mobile: { type: SwaggerDefinitionConstant.STRING, required: false },
          countryCode: { type: SwaggerDefinitionConstant.STRING, required: false },
        }
      }
    },
    responses: {},
    security: {
      BearerToken: []
    }
  })
  @httpPost("/", MIDDLEWARETYPES.AuthSuperadminMiddleware)
  public async createSubAdmin(req: Request, res: Response) { 
    try {
        await validatorForModel(res, SubadminCreatePayload, req.body);
        const payload: ICreateSubadmin = req.body;
        payload.role = APPLICATION_ROLE.ADMIN;
        payload.platform = PLATFORM.WEB;
        await this._userService.createUser(payload);  
        sendSuccess(res, HTTPSTATUS.SUCCESS_CREATE, null, MESSAGE.USER.CREATION.SUCEESS);
    } catch (e) {
     
      sendError(res, e.code, e.message, e.errors);
    }
  } 
}