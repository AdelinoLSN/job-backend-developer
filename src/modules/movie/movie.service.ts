import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';

import { OmdbService } from '../omdb/omdb.service';
import { DirectorService } from '../director/director.service';
import { ActorService } from '../actor/actor.service';

import { MultipleMoviesFoundException } from '../../common/exceptions/multiple-movies-found-exception.filter';

@Injectable()
export class MovieService {
  constructor(
    @Inject() private movieRepository: MovieRepository,
    @Inject() private omdbService: OmdbService,
    @Inject() private directorService: DirectorService,
    @Inject() private actorService: ActorService,
  ) {}

  async findByTitleOrCreate(title: string): Promise<Movie | null> {
    const movie = await this.movieRepository.findOneByTitle(title);

    if (movie) {
      return movie;
    }

    return this.createMovie(title);
  }

  private async createMovie(title: string): Promise<Movie> {
    const omdbMovies = await this.omdbService.searchMoviesByTitle(title);

    if (omdbMovies[0].Title !== title && omdbMovies.length > 1) {
      throw new MultipleMoviesFoundException(title, omdbMovies);
    }

    const omdbMovie = await this.omdbService.searchMovieById(
      omdbMovies[0].imdbID,
    );

    const directorsNames = omdbMovie.Director.split(', ');
    const directors =
      await this.directorService.findManyByNameOrCreate(directorsNames);

    const actorsNames = omdbMovie.Actors.split(', ');
    const actors = await this.actorService.findManyByNameOrCreate(actorsNames);

    const movie = new Movie({
      imdbId: omdbMovie.imdbID,
      title: omdbMovie.Title,
      releaseDate: new Date(omdbMovie.Released),
      rating: parseFloat(omdbMovie.imdbRating),
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
            const omdbMovie = await this.omdbService.searchMovieById(
              movie.imdbId,
            );

            const omdbRating = parseFloat(omdbMovie.imdbRating);

            if (parseFloat(movie.rating.toString()) === omdbRating) {
              return;
            }

            movie.rating = omdbRating;

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
