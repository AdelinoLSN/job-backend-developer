import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { MovieReview } from './movie-review.entity';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';

@Injectable()
export class MovieReviewRepository {
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

    return await this.repository.find(findManyOptions);
  }

  async create(movieReview: MovieReview): Promise<MovieReview> {
    return await this.repository.save(movieReview);
  }
}
