import type { ErrorCode } from "../constants/errorCodes";

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: ErrorCode | string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
