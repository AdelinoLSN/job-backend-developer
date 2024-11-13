import { Inject, Injectable } from '@nestjs/common';

import { MovieReviewViewRepository } from './movie-review-view.repository';
import { MovieReviewRepository } from '../movie-review/movie-review.repository';
import { MovieReviewViewQueueProducer } from './movie-review-view.queue.producer';
import { MovieReviewViewResponseDto } from './dtos/movie-review-view-response.dto';

@Injectable()
export class MovieReviewViewService {
  constructor(
    @Inject(MovieReviewViewQueueProducer)
    private queue: MovieReviewViewQueueProducer,
    @Inject(MovieReviewViewRepository)
    private movieReviewViewRepository: MovieReviewViewRepository,
    @Inject(MovieReviewRepository)
    private movieReviewRepository: MovieReviewRepository,
  ) {}

  async enqueueIncrementCount(movieReviewId: number) {
    this.queue.addIncrementCountJob(movieReviewId);
  }

  async create(movieReviewId: number) {
    const movieReview = await this.movieReviewRepository.findOne(movieReviewId);

    await this.movieReviewViewRepository.create({
      movieReview: movieReview,
    });
  }

  async increment(movieReviewId: number) {
    const movieReviewView =
      await this.movieReviewViewRepository.findOneByMovieReviewId(
        movieReviewId,
      );

    if (!movieReviewView) {
      await this.create(movieReviewId);
    }

    await this.movieReviewViewRepository.increment(movieReviewId);
  }

  async getMostViewedMovieReviews() {
    const movieReviews = await this.movieReviewViewRepository.findMostViewed();

    return movieReviews.map((movieReviewView) =>
      MovieReviewViewResponseDto.fromEntity(movieReviewView),
    );
  }
}
