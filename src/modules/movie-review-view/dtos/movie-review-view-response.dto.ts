import { MovieReviewView } from '../movie-review-view.entity';
import { MovieReviewResponseDto } from '../../movie-review/dtos/movie-review-response.dto';

export class MovieReviewViewResponseDto {
  count: number;
  movieReview: MovieReviewResponseDto;

  constructor(movieReviewView: MovieReviewView) {
    this.count = movieReviewView.count;
    this.movieReview = MovieReviewResponseDto.fromEntity(
      movieReviewView.movieReview,
    );
  }

  static fromEntity(entity: MovieReviewView): MovieReviewViewResponseDto {
    return new MovieReviewViewResponseDto(entity);
  }
}
