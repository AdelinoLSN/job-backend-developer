import { Inject, Injectable } from '@nestjs/common';

import { MovieReview } from './movie-review.entity';
import { MovieReviewFactory } from './movie-review.factory';
import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { MovieReviewRepository } from './movie-review.repository';

import { MovieService } from '../movie/movie.service';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';

import { MovieReviewNotFoundException } from '../../common/exceptions/movie-review-not-found-exception.filter';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

@Injectable()
export class MovieReviewService {
  constructor(
    @Inject(MovieReviewFactory) private movieReviewFactory: MovieReviewFactory,
    @Inject(MovieReviewRepository)
    private movieReviewRepository: MovieReviewRepository,
    @Inject(MovieService) private movieService: MovieService,
  ) {}

  async findMany(
    findManyMovieReviewDto: FindManyMovieReviewDto,
  ): Promise<MovieReview[]> {
    const movieReviews = await this.movieReviewRepository.findMany(
      findManyMovieReviewDto,
    );

    return movieReviews;
  }

  async create(movieReviewDto: CreateMovieReviewDto): Promise<MovieReview> {
    const movie = await this.movieService.findByTitleOrCreate(
      movieReviewDto.title,
    );

    const movieReview = this.movieReviewFactory.create({
      movie: movie,
      notes: movieReviewDto.notes,
    });

    await this.movieReviewRepository
      .create(movieReview)
      .then((createdMovieReview) => {
        movieReview.id = createdMovieReview.id;
      });

    return movieReview;
  }

  async findOne(id: number): Promise<MovieReview> {
    const movieReview = await this.movieReviewRepository.findOne(id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(id);
    }

    return movieReview;
  }

  async update(
    id: number,
    movieReviewDto: UpdateMovieReviewDto,
  ): Promise<MovieReview> {
    const movieReview = await this.movieReviewRepository.findOne(id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(id);
    }

    movieReview.notes = movieReviewDto.notes;

    await this.movieReviewRepository.update(movieReview);

    return movieReview;
  }

  async remove(id: number) {
    const movieReview = await this.movieReviewRepository.findOne(id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(id);
    }

    await this.movieReviewRepository.delete(movieReview.id);
  }
}
