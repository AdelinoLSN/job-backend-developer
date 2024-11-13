import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';

import { MovieReviewView } from './movie-review-view.entity';

@Injectable()
export class MovieReviewViewRepository {
  constructor(
    @InjectRepository(MovieReviewView)
    private movieReviewViewRepository: Repository<MovieReviewView>,
  ) {}

  async findMostViewed(): Promise<MovieReviewView[]> {
    return this.movieReviewViewRepository.find({
      relations: [
        'movieReview',
        'movieReview.movie',
        'movieReview.movie.directors',
        'movieReview.movie.actors',
        'movieReview.movie.directors.person',
        'movieReview.movie.actors.person',
      ],
      where: { movieReview: { id: Not(IsNull()) } },
      order: { count: 'DESC' },
      take: 10,
    });
  }

  async create(data: Partial<MovieReviewView>) {
    await this.movieReviewViewRepository.save(data);
  }

  async findOneByMovieReviewId(movieReviewId: number) {
    return this.movieReviewViewRepository.findOne({
      where: { movieReview: { id: movieReviewId } },
    });
  }

  async increment(movieReviewId: number) {
    await this.movieReviewViewRepository.increment(
      { movieReview: { id: movieReviewId } },
      'count',
      1,
    );
  }
}
