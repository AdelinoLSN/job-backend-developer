import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovieReview } from './movie-review.entity';

@Injectable()
export class MovieReviewRepository {
  constructor(
    @InjectRepository(MovieReview) private repository: Repository<MovieReview>,
  ) {}

  async findMany(): Promise<MovieReview[]> {
    return await this.repository.find({
      relations: [
        'movie',
        'movie.directors',
        'movie.actors',
        'movie.directors.person',
        'movie.actors.person',
      ],
    });
  }

  async create(movieReview: MovieReview): Promise<MovieReview> {
    return await this.repository.save(movieReview);
  }
}
