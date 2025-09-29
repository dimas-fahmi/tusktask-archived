export class OperationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "OperationError";
    this.code = code;
  }
}
