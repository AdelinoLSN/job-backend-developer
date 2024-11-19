import { Injectable } from '@nestjs/common';

import { MovieDatabaseProvider } from './movie-database.provider';

import { MovieNotFoundException } from '../../common/exceptions/movie-not-found-exception.filter';
import { OpenMovieDatabaseRequestException } from '../../common/exceptions/open-movie-database-request-exception.filter';

@Injectable()
export class OpenMovieDatabaseProvider implements MovieDatabaseProvider {
  private openMovieDatabaseUrl: string;

  constructor() {
    this.openMovieDatabaseUrl = `${process.env.OMDB_BASE_URL}?apikey=${process.env.OMDB_API_KEY}&`;
  }

  async searchByTitle(title: string): Promise<any[]> {
    const queryParams = [{ key: 's', value: title }];

    const response = await this.fetchData(queryParams);

    if (response.Error) {
      throw new MovieNotFoundException();
    }

    return response.Search;
  }

  async searchById(id: string): Promise<any> {
    const queryParams = [{ key: 'i', value: id }];

    const response = await this.fetchData(queryParams);

    if (response.Error) {
      throw new MovieNotFoundException();
    }

    return response;
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
