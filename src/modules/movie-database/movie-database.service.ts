import { Injectable } from '@nestjs/common';

import { MovieDatabaseProvider } from './movie-database.provider';

@Injectable()
export class MovieDatabaseService {
  constructor(private movieDatabaseProvider: MovieDatabaseProvider) {}

  async searchMoviesByTitle(title: string) {
    return this.movieDatabaseProvider.searchByTitle(title);
  }

  async searchMovieById(id: string) {
    return this.movieDatabaseProvider.searchById(id);
  }
}
