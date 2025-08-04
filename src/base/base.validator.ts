import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AuthenticatedRequest, IHelperFunctions } from '../common/interfaces/common.interface';
import { CustomError } from '../utils/error';

export abstract class BaseValidator {

  constructor(
    private helperFunctions: IHelperFunctions
  ) { }
  /**
   * Middleware to validate incoming request using a Joi schema
   */
  protected getRequestErrors (schema: Joi.Schema) {
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
          .map((singleError) => this.errorFormatter(singleError))
          .join(', ');
        return this.helperFunctions.handleErrorResponse(
          res,
          new CustomError({
            message: 'Invalid Request',
            status: 400,
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
  private errorFormatter (singleError: Joi.ValidationErrorItem): string {
    let message = singleError.message.replace(/""/g, '');

    if (this.isRequired(singleError.message)) {
      return message;
    }

    return `Parameter ${message}`;
  }

  /**
   * Checks whether a field is required
   */
  private isRequired (message: string): boolean {
    console.log(message)
    return message.toLowerCase().includes('required');
  }
}
