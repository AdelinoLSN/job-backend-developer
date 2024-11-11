import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { Factory } from './factory';

import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { MovieReviewRepository } from '../../src/modules/movie-review/movie-review.repository';

import { MovieFactory } from './movie.factory';

export class MovieReviewFactory extends Factory<MovieReview> {
  private repository: MovieReviewRepository;
  private movieFactory: MovieFactory;

  constructor(module: TestingModule) {
    super();
    this.repository = module.get<MovieReviewRepository>(MovieReviewRepository);
    this.movieFactory = new MovieFactory(module);
  }

  async findOne(id: number): Promise<MovieReview> {
    return this.repository.findOne(id);
  }

  async make(data: Partial<MovieReview> = {}): Promise<MovieReview> {
    const movie = await this.movieFactory.make();

    const movieReview = new MovieReview({
      notes: (data.notes || faker.lorem.paragraph()) as string,
      movie,
    });

    return this.repository.create(movieReview);
  }

  async makeMany(
    count: number,
    data: Partial<MovieReview> = {},
  ): Promise<MovieReview[]> {
    const movieReviews: MovieReview[] = [];

    for (let i = 0; i < count; i++) {
      movieReviews.push(await this.make(data));
    }

    return movieReviews;
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
