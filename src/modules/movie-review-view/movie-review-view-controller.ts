import { Controller, Get } from '@nestjs/common';

import { MovieReviewViewService } from './movie-review-view.service';

@Controller('most-viewed-movie-reviews')
export class MovieReviewViewController {
  constructor(
    private readonly movieReviewViewService: MovieReviewViewService,
  ) {}

  @Get()
  async getMostViewedMovieReviews() {
    return this.movieReviewViewService.getMostViewedMovieReviews();
  }
}
