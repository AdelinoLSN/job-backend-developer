import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';

import { MovieDatabaseService } from '../movie-database/movie-database.service';
import { DirectorService } from '../director/director.service';
import { ActorService } from '../actor/actor.service';

import { MultipleMoviesFoundException } from '../../common/exceptions/multiple-movies-found-exception.filter';
import { MovieFactory } from './movie.factory';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MovieFactory) private movieFactory: MovieFactory,
    @Inject(MovieRepository) private movieRepository: MovieRepository,
    @Inject(MovieDatabaseService)
    private movieDatabaseService: MovieDatabaseService,
    @Inject(DirectorService) private directorService: DirectorService,
    @Inject(ActorService) private actorService: ActorService,
  ) {}

  async findByTitleOrCreate(title: string): Promise<Movie | null> {
    const movie = await this.movieRepository.findOneByTitle(title);

    if (movie) {
      return movie;
    }

    return this.createMovie(title);
  }

  private async createMovie(title: string): Promise<Movie> {
    const movieDatabaseMovies =
      await this.movieDatabaseService.searchMoviesByTitle(title);

    if (
      movieDatabaseMovies[0].Title !== title &&
      movieDatabaseMovies.length > 1
    ) {
      throw new MultipleMoviesFoundException(title, movieDatabaseMovies);
    }

    const movieDatabaseMovieDetails =
      await this.movieDatabaseService.searchMovieById(
        movieDatabaseMovies[0].imdbID,
      );

    const directorsNames = movieDatabaseMovieDetails.Director.split(', ');
    const directors =
      await this.directorService.findManyByNameOrCreate(directorsNames);

    const actorsNames = movieDatabaseMovieDetails.Actors.split(', ');
    const actors = await this.actorService.findManyByNameOrCreate(actorsNames);

    const movie = this.movieFactory.create({
      imdbId: movieDatabaseMovieDetails.imdbID,
      title: movieDatabaseMovieDetails.Title,
      releaseDate: new Date(movieDatabaseMovieDetails.Released),
      rating: parseFloat(movieDatabaseMovieDetails.imdbRating),
      directors: directors,
      actors: actors,
    });

    await this.movieRepository.create(movie).then((createdMovie) => {
      movie.id = createdMovie.id;
    });

    return movie;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateMoviesRatings(): Promise<void> {
    const limit = 10;
    let offset = 0;

    while (true) {
      try {
        const movies = await this.movieRepository.findMany(limit, offset);

        if (movies.length === 0) {
          break;
        }

        await Promise.all(
          movies.map(async (movie) => {
            const movieDatabaseMovieDetails =
              await this.movieDatabaseService.searchMovieById(movie.imdbId);

            const rating = parseFloat(movieDatabaseMovieDetails.imdbRating);

            if (parseFloat(movie.rating.toString()) === rating) {
              return;
            }

            movie.rating = rating;

            await this.movieRepository.update(movie);
          }),
        );

        if (movies.length < limit) {
          break;
        }

        offset += limit;
      } catch (e) {
        console.error(e);
        break;
      }
    }
  }
}
