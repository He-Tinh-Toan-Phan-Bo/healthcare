import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SKIP_RESPONSE_TRANSFORM_KEY } from '../decorators/skip-response-transform.decorator';

type StandardResponse = {
  statusCode: number;
  data: unknown;
  message?: string;
};

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkip) return next.handle();

    const res = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    return next.handle().pipe(map((payload) => this.normalize(payload, res.statusCode)));
  }

  private normalize(payload: unknown, statusCode: number): StandardResponse {
    if (payload && typeof payload === 'object') {
      const maybe = payload as Record<string, unknown>;
      if ('statusCode' in maybe && 'data' in maybe) return payload as StandardResponse;

      if ('message' in maybe) {
        const { message, ...rest } = maybe;
        return {
          statusCode,
          message: String(message),
          data: Object.keys(rest).length ? rest : null,
        };
      }
    }

    return { statusCode, data: payload ?? null };
  }
}

