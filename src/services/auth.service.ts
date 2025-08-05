import { LoginRequst } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { CustomError } from "../utils/error";
import { handleError, isEmail } from "../utils/helperFunctions";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/common";

export const loginUser = async (body: LoginRequst) => {
  const { identifier, password } = body;

  try {
    const user = await userRepository.fetchSingleUser({
      where: isEmail(identifier)
        ? { email: identifier }
        : { phone_number: identifier },
    });

    if (!user) {
      throw new CustomError({
        message: HTTP_STATUS_MESSAGES.NOTE_FOUND,
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new CustomError({
        message: HTTP_STATUS_MESSAGES.INVALID_CREDENTIALS,
        status: HTTP_STATUS_CODES.FORM_ERROR
      })
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string, // ensure fallback
      {
        expiresIn: (process.env.JWT_DEFAULT_EXPIRY_IN_DAYS
          ? `${process.env.JWT_DEFAULT_EXPIRY_IN_DAYS}d`
          : "7d") as jwt.SignOptions["expiresIn"],
      }
    );

    return { user_id: user.id, token }
  } catch (error) {
    return handleError(error)
  }
}