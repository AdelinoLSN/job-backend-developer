import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovieReview } from './movie-review.entity';

@Injectable()
export class MovieReviewRepository {
  constructor(
    @InjectRepository(MovieReview) private repository: Repository<MovieReview>,
  ) {}

  async create(movieReview: MovieReview): Promise<MovieReview> {
    return await this.repository.save(movieReview);
  }
}
