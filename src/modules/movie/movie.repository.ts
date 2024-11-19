import { Movie } from './movie.entity';

export abstract class MovieRepository {
  abstract findMany(limit: number, offset: number): Promise<Movie[]>;
  abstract findOneByTitle(title: string): Promise<Movie | null>;
  abstract create(movie: Movie): Promise<Movie>;
  abstract update(movie: Movie): Promise<Movie>;
}
