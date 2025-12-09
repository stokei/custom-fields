import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ExceptionType } from '@/shared/domain/errors/base/exception-types';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HttpMethod } from '../enums/http-method';

export class HttpExceptionResponseError<TErrorDetails = any> {
  @ApiProperty({ enum: ExceptionType })
  public type!: ExceptionType;
  @ApiProperty({ enum: ExceptionCode })
  public code!: ExceptionCode;
  @ApiProperty({ type: [String] })
  public message!: string[];
  @ApiPropertyOptional({ type: 'array', items: { type: 'object' } })
  public details?: TErrorDetails[];
}
interface HttpExceptionResponseProps<TErrorDetails = any> {
  statusCode: number;
  path: string;
  method: HttpMethod;
  error: HttpExceptionResponseError<TErrorDetails>;
}

export class HttpExceptionResponse<TErrorDetails = any> {
  @ApiProperty({ enum: HttpStatus })
  public statusCode: HttpStatus;
  @ApiProperty()
  public path: string;
  @ApiProperty({ enum: HttpMethod })
  public method: HttpMethod;
  @ApiProperty({ description: 'ISO 8601 timestamp' })
  public timestamp: string;
  @ApiProperty({ type: HttpExceptionResponseError })
  public error: HttpExceptionResponseError<TErrorDetails>;

  private constructor(data: HttpExceptionResponseProps<TErrorDetails>) {
    this.statusCode = data.statusCode;
    this.path = data.path;
    this.method = data.method;
    this.timestamp = new Date().toISOString();
    this.error = data.error;
  }

  static create<TErrorDetails = any>(
    data: HttpExceptionResponseProps<TErrorDetails>,
  ): HttpExceptionResponse<TErrorDetails> {
    return new HttpExceptionResponse<TErrorDetails>(data);
  }

  setError(error: HttpExceptionResponseError<TErrorDetails>) {
    this.error = error;
  }
  setStatusCode(status: HttpStatus) {
    this.statusCode = status;
  }
}
