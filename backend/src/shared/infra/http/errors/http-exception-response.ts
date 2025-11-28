export interface HttpExceptionResponseDetailsBase {
  type: string;
  messsage: string;
  details?: any[];
}
interface HttpExceptionResponseProps<ErrorDetails> {
  statusCode: number;
  path: string;
  method: string;
  error: ErrorDetails;
}

export class HttpExceptionResponse<
  ErrorDetails extends HttpExceptionResponseDetailsBase = any,
> {
  public statusCode: number;
  public path: string;
  public method: string;
  public timestamp: string;
  public error: ErrorDetails;

  private constructor(data: HttpExceptionResponseProps<ErrorDetails>) {
    this.statusCode = data.statusCode;
    this.path = data.path;
    this.method = data.method;
    this.timestamp = new Date().toISOString();
    this.error = data.error;
  }

  static create<ErrorDetails extends HttpExceptionResponseDetailsBase>(
    data: HttpExceptionResponseProps<ErrorDetails>,
  ): HttpExceptionResponse<ErrorDetails> {
    return new HttpExceptionResponse<ErrorDetails>(data);
  }
}
