import { Injectable } from '@nestjs/common';

import { Movie } from './movie.entity';

@Injectable()
export class MovieFactory {
  constructor() {}

  create(movie: Partial<Movie>): Movie {
    return new Movie({
      imdbId: movie.imdbId,
      title: movie.title,
      releaseDate: movie.releaseDate,
      rating: movie.rating,
      directors: movie.directors,
      actors: movie.actors,
    });
  }
}
