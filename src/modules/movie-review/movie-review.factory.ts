import { Injectable } from '@nestjs/common';

import { MovieReview } from './movie-review.entity';

@Injectable()
export class MovieReviewFactory {
  constructor() {}

  create(movieReview: Partial<MovieReview>): MovieReview {
    return new MovieReview({
      movie: movieReview.movie,
      notes: movieReview.notes,
    });
  }
}
