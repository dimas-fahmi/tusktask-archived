export interface StandaradizedError {
  code: string;
  message: string;
  status?: number;
}

export class OperationError extends Error {
  code: string;
  status: number;
  context?: unknown;

  constructor(
    code: string,
    message: string,
    status?: number,
    context?: unknown,
  ) {
    super(message);
    this.name = "OperationError";
    this.code = code;
    this.status = status || 500;
    this.context = context;
  }
}
