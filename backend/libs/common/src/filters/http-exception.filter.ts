import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type HttpExceptionResponseBody = {
  message?: string | string[];
  error?: string;
  code?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const normalized = this.normalizeError(status, exceptionResponse);

    const errorResponse = {
      statusCode: status,
      code: normalized.code,
      message: normalized.message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json(errorResponse);
  }

  private normalizeError(
    status: number,
    payload: string | object,
  ): { code: string; message: string | string[] } {
    if (typeof payload === 'string') {
      return { code: this.mapErrorCode(status), message: payload };
    }

    const body = payload as HttpExceptionResponseBody;
    const message = body.message ?? 'Internal server error';
    return { code: body.code ?? this.mapErrorCode(status, message), message };
  }

  private mapErrorCode(status: number, rawMessage?: string | string[]): string {
    switch (status) {
      case 400:
        if (Array.isArray(rawMessage)) return 'VALIDATION_ERROR';
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'RESOURCE_NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return `HTTP_${status}_ERROR`;
    }
  }
}
