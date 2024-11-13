import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MovieReviewViewService } from '../../modules/movie-review-view/movie-review-view.service';

@Injectable()
export class IncrementMovieReviewViewInterceptor implements NestInterceptor {
  constructor(
    @Inject(MovieReviewViewService)
    private movieReviewViewService: MovieReviewViewService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        complete: () => {
          this.movieReviewViewService.enqueueIncrementCount(request.params.id);
        },
      }),
    );
  }
}
