import { HttpException, HttpStatus } from '@nestjs/common';

import { OmdbMovie } from '../../modules/omdb/interfaces/omdb-movie.interface';

export class MultipleMoviesFoundException extends HttpException {
  constructor(title: string, movies: OmdbMovie[]) {
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
