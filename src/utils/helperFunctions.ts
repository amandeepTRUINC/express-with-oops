import { Response } from "express";
import { GlobalResponse, IHelperFunctions } from "../common/interfaces/common.interface";
import { CustomError } from "./error";
import bcrypt from 'bcrypt'
class HelperFunctions implements IHelperFunctions {
  private readonly SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string) || 10

  /**
   * Hash a plain password using bcrypt.
   * @param rawPassword - the plain text password
   * @returns hashed password string
   */
  async hashPassword (rawPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password: ' + error);
    }
  }
  /**
   * method to throw standardized CustomError
   */
  handleError (error: unknown): CustomError {
    if (error instanceof CustomError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    throw new CustomError({ message, status: 500 });
  }

  /**
   * Sends a successful JSON response
   */
  handleSuccessResponse (props: GlobalResponse): Response {
    const { data = [], message = 'SUCCESS', res, status = 200, error } = props;
    return res.status(status as number).json({
      message,
      status,
      data,
      error: error ?? null
    });
  }

  /**
   * Sends an error JSON response
   */
  handleErrorResponse (res: Response, errorDetails: CustomError | unknown): Response {
    let message: string = 'INTERNAL SERVER ERROR';
    let status: number = 500;

    if (errorDetails instanceof CustomError) {
      message = errorDetails.message;
      status = errorDetails.status;
    } else {
      try {
        this.handleError(errorDetails);
      } catch (error) {
        const err = error as CustomError;
        message = err.message;
        status = err.status;
        errorDetails = err;
      }
    }

    return res.status(status).json({
      message,
      status,
      data: [],
      error: errorDetails
    });
  }
}

export const helperFunctions = new HelperFunctions()