import { Response } from "express";

export const sendError = function (res: Response, code: number, message: string, errors: any = null) {
	res.status(code).send({ success: false, message, errors, code });
};

export const sendSuccess = function (res: Response, code: number, data: any, message: string = '') {
	res.status(code).send({ success: true, message, data, code});
};