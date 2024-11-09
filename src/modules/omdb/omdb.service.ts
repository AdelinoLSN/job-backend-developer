import { Injectable } from '@nestjs/common';

import { OmdbProvider } from './omdb.provider';

@Injectable()
export class OmdbService {
  constructor(private omdbProvider: OmdbProvider) {}

  async searchMoviesByTitle(title: string) {
    const omdbItems = await this.omdbProvider.searchByTitle(title);

    return omdbItems.filter((item) => item.Type === 'movie');
  }
}
