import { HttpException, HttpStatus } from '@nestjs/common';

import { MovieDatabaseMovie } from '../../modules/movie-database/types/movie-database-movie.types';

export class MultipleMoviesFoundException extends HttpException {
  constructor(title: string, movies: MovieDatabaseMovie[]) {
    super(
      `Multiple movies found for title "${title}": ${movies
        .map((movie) => {
          return `${movie.Title} (${movie.Year})`;
        })
        .join(', ')}`,
      HttpStatus.CONFLICT,
    );
  }
}
