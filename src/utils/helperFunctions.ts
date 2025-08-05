import { Response } from "express";
import { GlobalResponse } from "../interfaces/common.interface";
import { CustomError } from "./error";
import bcrypt from 'bcrypt';
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/common";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string) || 10;

/**
 * Hash a plain password using bcrypt.
 */
async function hashPassword(rawPassword: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error);
  }
}

/**
 * method to throw standardized CustomError
 */
function handleError(error: unknown): CustomError {
  if (error instanceof CustomError) {
    throw error;
  }
  const message = error instanceof Error ? error.message : HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
  throw new CustomError({ message, status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR });
}

/**
 * Sends a successful JSON response
 */
function handleSuccessResponse(props: GlobalResponse): Response {
  const { data = [], message = HTTP_STATUS_MESSAGES.SUCCESS, res, status = HTTP_STATUS_CODES.SUCCESS, error } = props;
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
function handleErrorResponse(res: Response, errorDetails: CustomError | unknown): Response {
  let message: string = HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
  let status: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

  if (errorDetails instanceof CustomError) {
    message = errorDetails.message;
    status = errorDetails.status;
  } else {
    try {
      handleError(errorDetails);
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

function isEmail(identifier: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}
export { hashPassword, handleError, handleSuccessResponse, handleErrorResponse, isEmail };