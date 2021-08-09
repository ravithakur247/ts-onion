"use strict";
import * as randomstring from 'randomstring';

export const generateRandomString = function(digits: number) {
	return randomstring.generate(digits);
};