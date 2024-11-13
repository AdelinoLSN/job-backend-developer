import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private static readonly logger = new Logger(RequestLogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          RequestLogInterceptor.logger.log(
            `${method} ${url} ${Date.now() - now}ms`,
          ),
        error: () =>
          RequestLogInterceptor.logger.log(
            `${method} ${url} ${Date.now() - now}ms`,
          ),
      }),
    );
  }
}
