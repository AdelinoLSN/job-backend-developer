import { Injectable } from '@nestjs/common';

import { OmdbMovie } from './interfaces/omdb-movie.interface';

import { MovieNotFoundException } from '../../common/exceptions/movie-not-found-exception.filter';
import { OmdbProviderRequestException } from '../../common/exceptions/omdb-provider-request-exception.filter';

@Injectable()
export class OmdbProvider {
  private omdbUrl: string;

  constructor() {
    this.omdbUrl = `${process.env.OMDB_BASE_URL}?apikey=${process.env.OMDB_API_KEY}&`;
  }

  async searchByTitle(title: string): Promise<OmdbMovie[]> {
    const queryParams = [{ key: 's', value: title }];

    const response = await this.fetchData(queryParams);

    if (response.Error) {
      throw new MovieNotFoundException();
    }

    return response.Search;
  }

  async fetchData(queryParams: { key: string; value: string }[]) {
    try {
      const url =
        this.omdbUrl +
        queryParams.map((param) => `${param.key}=${param.value}`).join('&');

      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      throw new OmdbProviderRequestException(error);
    }
  }
}
