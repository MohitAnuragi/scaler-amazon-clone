export type ValidationErrorItem = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: ValidationErrorItem[];

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errors?: ValidationErrorItem[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
