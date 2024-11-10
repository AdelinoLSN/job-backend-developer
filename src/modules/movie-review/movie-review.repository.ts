import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { MovieReview } from './movie-review.entity';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';

@Injectable()
export class MovieReviewRepository {
  private static readonly DEFAULT_LIMIT = 10;

  constructor(
    @InjectRepository(MovieReview) private repository: Repository<MovieReview>,
  ) {}

  async findMany(
    findManyMovieReviewParams: FindManyMovieReviewDto,
  ): Promise<MovieReview[]> {
    const findManyOptions: FindManyOptions<MovieReview> = {
      relations: [
        'movie',
        'movie.directors',
        'movie.actors',
        'movie.directors.person',
        'movie.actors.person',
      ],
    };

    if (findManyMovieReviewParams.title) {
      findManyOptions.where = {
        movie: { title: Like(`${findManyMovieReviewParams.title}%`) },
      };
    }

    if (findManyMovieReviewParams.director) {
      findManyOptions.where = {
        ...findManyOptions.where,
        movie: {
          directors: {
            person: { name: Like(`${findManyMovieReviewParams.director}%`) },
          },
        },
      };
    }

    if (findManyMovieReviewParams.actor) {
      findManyOptions.where = {
        ...findManyOptions.where,
        movie: {
          actors: {
            person: { name: Like(`${findManyMovieReviewParams.actor}%`) },
          },
        },
      };
    }

    if (findManyMovieReviewParams.orderBy) {
      findManyOptions.order = {
        movie: {
          [findManyMovieReviewParams.orderBy]:
            findManyMovieReviewParams.order || 'ASC',
        },
      };
    }

    if (findManyMovieReviewParams.page) {
      findManyOptions.skip =
        (findManyMovieReviewParams.page - 1) *
        (findManyMovieReviewParams.limit ||
          MovieReviewRepository.DEFAULT_LIMIT);
      findManyOptions.take =
        findManyMovieReviewParams.limit || MovieReviewRepository.DEFAULT_LIMIT;
    }

    return await this.repository.find(findManyOptions);
  }

  async create(movieReview: MovieReview): Promise<MovieReview> {
    return await this.repository.save(movieReview);
  }

  async findOne(id: number): Promise<MovieReview> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'movie',
        'movie.directors',
        'movie.actors',
        'movie.directors.person',
        'movie.actors.person',
      ],
    });
  }
}
