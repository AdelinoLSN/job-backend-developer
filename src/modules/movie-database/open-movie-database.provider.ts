import { Injectable } from '@nestjs/common';

import { MovieDatabaseProvider } from './movie-database.provider';
import { MovieDatabaseMovie } from './types/movie-database-movie.types';
import { MovieDatabaseMovieDetails } from './types/movie-database-movie-details.types';
import { OpenMovieDatabaseMovie } from './types/open-movie-database-movie.types';
import { OpenMovieDatabaseMovieDetails } from './types/open-movie-database-movie-details.types';

import { MovieNotFoundException } from '../../common/exceptions/movie-not-found-exception.filter';
import { OpenMovieDatabaseRequestException } from '../../common/exceptions/open-movie-database-request-exception.filter';

@Injectable()
export class OpenMovieDatabaseProvider implements MovieDatabaseProvider {
  private openMovieDatabaseUrl: string;

  constructor() {
    this.openMovieDatabaseUrl = `${process.env.OMDB_BASE_URL}?apikey=${process.env.OMDB_API_KEY}&`;
  }

  async searchByTitle(title: string): Promise<MovieDatabaseMovie[]> {
    const queryParams = [{ key: 's', value: title }];

    const response = await this.fetchData(queryParams);

    if (response.Error) {
      throw new MovieNotFoundException();
    }

    return response.Search as OpenMovieDatabaseMovie[];
  }

  async searchById(id: string): Promise<MovieDatabaseMovieDetails> {
    const queryParams = [{ key: 'i', value: id }];

    const response = await this.fetchData(queryParams);

    if (response.Error) {
      throw new MovieNotFoundException();
    }

    return response as OpenMovieDatabaseMovieDetails;
  }

  async fetchData(queryParams: { key: string; value: string }[]): Promise<any> {
    try {
      const url =
        this.openMovieDatabaseUrl +
        queryParams.map((param) => `${param.key}=${param.value}`).join('&');

      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      throw new OpenMovieDatabaseRequestException(error);
    }
  }
}
