import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MovieReview } from '../movie-review/movie-review.entity';

@Entity()
export class MovieReviewView {
  constructor(partial: Partial<MovieReview>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MovieReview)
  @JoinColumn({ name: 'movieReviewId' })
  movieReview: MovieReview;

  @Column({ default: 0 })
  count: number;
}
