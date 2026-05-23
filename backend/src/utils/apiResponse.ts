export class ApiResponse<T> {
  public readonly success: true;
  public readonly data: T;
  public readonly message: string;
  public readonly pagination?: Record<string, number>;

  constructor(data: T, message = "OK", pagination?: Record<string, number>) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.pagination = pagination;
  }
}
