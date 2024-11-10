import { MovieReview } from '../movie-review.entity';

export class MovieReviewResponseDto {
  movieReviewId: number;
  title: string;
  releaseDate: string;
  rating: number;
  directors: string[];
  actors: string[];
  notes: string;

  constructor(movieReview: MovieReview) {
    this.movieReviewId = movieReview.id;
    this.title = movieReview.movie.title;
    this.releaseDate = new Date(movieReview.movie.releaseDate)
      .toISOString()
      .split('T')[0];
    this.rating = Number(movieReview.movie.rating);
    this.directors = movieReview.movie.directors.map(
      (director) => director.person.name,
    );
    this.actors = movieReview.movie.actors.map((actor) => actor.person.name);
    this.notes = movieReview.notes;
  }

  static fromEntity(entity: MovieReview): MovieReviewResponseDto {
    return new MovieReviewResponseDto(entity);
  }
}
