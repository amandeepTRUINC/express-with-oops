import { ICustomError } from "../interfaces/shared/common.interface";

export class CustomError implements ICustomError {
  public message: string;
  public status: number;
  public extraMessage: unknown
  constructor({ message, status, extraMessage }: ICustomError) {
    this.message = message || '';
    this.status = status as number;
    this.extraMessage = extraMessage
  }
}

