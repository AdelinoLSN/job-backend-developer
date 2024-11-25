import { MovieDatabaseMovie } from './types/movie-database-movie.types';
import { MovieDatabaseMovieDetails } from './types/movie-database-movie-details.types';

export abstract class MovieDatabaseProvider {
  abstract searchByTitle(title: string): Promise<MovieDatabaseMovie[]>;
  abstract searchById(id: string): Promise<MovieDatabaseMovieDetails>;
  abstract fetchData(
    queryParams: { key: string; value: string }[],
  ): Promise<any>;
}
