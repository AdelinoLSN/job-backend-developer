import { Inject, Injectable } from '@nestjs/common';

import { MovieReview } from './movie-review.entity';
import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { MovieReviewRepository } from './movie-review.repository';
import { MovieReviewResponse } from './types/movie-review-response.types';

import { MovieService } from '../movie/movie.service';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';

@Injectable()
export class MovieReviewService {
  constructor(
    @Inject() private movieReviewRepository: MovieReviewRepository,
    @Inject() private movieService: MovieService,
  ) {}

  async findMany(
    findManyMovieReviewDto: FindManyMovieReviewDto,
  ): Promise<MovieReviewResponse[]> {
    const movieReviews = await this.movieReviewRepository.findMany(
      findManyMovieReviewDto,
    );

    return movieReviews.map((movieReview) => ({
      movieReviewId: movieReview.id,
      title: movieReview.movie.title,
      releaseDate: movieReview.movie.releaseDate,
      rating: movieReview.movie.rating,
      directors: movieReview.movie.directors.map(
        (director) => director.person.name,
      ),
      actors: movieReview.movie.actors.map((actor) => actor.person.name),
      notes: movieReview.notes,
    }));
  }

  async create(
    movieReviewDto: CreateMovieReviewDto,
  ): Promise<MovieReviewResponse> {
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

    return {
      movieReviewId: movieReview.id,
      title: movieReview.movie.title,
      releaseDate: movieReview.movie.releaseDate,
      rating: movieReview.movie.rating,
      directors: movieReview.movie.directors.map(
        (director) => director.person.name,
      ),
      actors: movieReview.movie.actors.map((actor) => actor.person.name),
      notes: movieReview.notes,
    };
  }
}
