import { MovieReview } from './movie-review.entity';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';

export abstract class MovieReviewRepository {
  public static readonly DEFAULT_LIMIT = 10;

  abstract findMany(
    findManyMovieReviewParams: FindManyMovieReviewDto,
  ): Promise<MovieReview[]>;
  abstract create(movieReview: MovieReview): Promise<MovieReview>;
  abstract findOne(id: number): Promise<MovieReview>;
  abstract update(movieReview: MovieReview): Promise<MovieReview>;
  abstract delete(id: number): Promise<void>;
}
