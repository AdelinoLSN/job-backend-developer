import { Inject, Injectable } from '@nestjs/common';

import { MovieReview } from './movie-review.entity';
import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { MovieReviewRepository } from './movie-review.repository';

import { MovieService } from '../movie/movie.service';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';
import { MovieReviewResponseDto } from './dtos/movie-review-response.dto';

@Injectable()
export class MovieReviewService {
  constructor(
    @Inject() private movieReviewRepository: MovieReviewRepository,
    @Inject() private movieService: MovieService,
  ) {}

  async findMany(
    findManyMovieReviewDto: FindManyMovieReviewDto,
  ): Promise<MovieReviewResponseDto[]> {
    const movieReviews = await this.movieReviewRepository.findMany(
      findManyMovieReviewDto,
    );

    return movieReviews.map((movieReview) =>
      MovieReviewResponseDto.fromEntity(movieReview),
    );
  }

  async create(
    movieReviewDto: CreateMovieReviewDto,
  ): Promise<MovieReviewResponseDto> {
    const movie = await this.movieService.findByTitleOrCreate(
      movieReviewDto.title,
    );

    const movieReview = new MovieReview({
      movie: movie,
      notes: movieReviewDto.notes,
    });

    await this.movieReviewRepository
      .create(movieReview)
      .then((createdMovieReview) => {
        movieReview.id = createdMovieReview.id;
      });

    return MovieReviewResponseDto.fromEntity(movieReview);
  }
}
