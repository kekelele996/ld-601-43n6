export class BusinessError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "BusinessError";
    this.status = status;
    this.code = code;
  }
}
