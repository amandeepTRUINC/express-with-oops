import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AuthenticatedRequest } from '../interfaces/common.interface';
import { CustomError } from '../utils/error';
import { handleErrorResponse } from '../utils/helperFunctions';
import { 
  createUserValidationsSchema, 
  updateUserValidationsSchema, 
  validateUserIdSchema, 
  validateLoginUserReqSchema, 
  validateUpdateStatusSchema,
  validateSearchUserSchema
} from './users/user.validationsSchema'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../constants/common';
import { createRestaurantValidationsSchema, updateRestaurantStatusSchema, updateRestaurantValidationsSchema } from './restaurant/restaurant.validationsSchema';
import { createBuildingSchema, updateBuildingSchema, validateBuildingIdSchema, allocateBuildingSchema, deAllocateBuildingSchema } from './buildings/building.validationsSchema';
export const getRequestErrors = (schema: Joi.Schema) => {
  return (
    req: Request<any, any, any, any> | AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { params, body } = req as Request;
    const requestBody = { ...params, ...body };

    const { error } = schema.validate(requestBody, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const validationError = error.details
        .map((singleError) => errorFormatter(singleError))
        .join(', ');
      return handleErrorResponse(
        res,
        new CustomError({
          message: HTTP_STATUS_MESSAGES.FORM_ERROR,
          status: HTTP_STATUS_CODES.FORM_ERROR,
          extraMessage: validationError
        })
      );
    }

    return next();
  };
}


/**
 * Formats individual Joi error messages
 */
const errorFormatter = (singleError: Joi.ValidationErrorItem): string => {
  let message = singleError.message.replace(/""/g, '');

  if (isRequired(singleError.message)) {
    return message;
  }

  return `Parameter ${message}`;
}

/**
 * Checks whether a field is required
 */
const isRequired = (message: string): boolean => {
  return message.toLowerCase().includes('required');
}



export const validateCreateUserReq = getRequestErrors(createUserValidationsSchema)
export const validateUpdateUserReq = getRequestErrors(updateUserValidationsSchema)
export const validateUserIdInReq = getRequestErrors(validateUserIdSchema)
export const validateLoginUserReq = getRequestErrors(validateLoginUserReqSchema)
export const validateUpdateUserStatusReq = getRequestErrors(validateUpdateStatusSchema)
export const validateSearchUserReq = getRequestErrors(validateSearchUserSchema)

export const validateCreateRestaurantReq = getRequestErrors(createRestaurantValidationsSchema)
export const validateUpdateRestaurantReq = getRequestErrors(updateRestaurantValidationsSchema)
export const validateUpdateRestaurantStatusReq = getRequestErrors(updateRestaurantStatusSchema)


export const validateCreateBuildingReq = getRequestErrors(createBuildingSchema)
export const validateBuildingIdReq = getRequestErrors(validateBuildingIdSchema)
export const validateUpdateBuildingReq = getRequestErrors(updateBuildingSchema)
export const validateAllocateBuildingReq = getRequestErrors(allocateBuildingSchema)
export const validateDeAllocateBuildingReq = getRequestErrors(deAllocateBuildingSchema)