import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { Factory } from './factory';

import { Movie } from '../../src/modules/movie/movie.entity';
import { MovieRepository } from '../../src/modules/movie/movie.repository';

import { DirectorFactory } from './director.factory';
import { ActorFactory } from './actor.factory';

export class MovieFactory extends Factory<Movie> {
  private repository: MovieRepository;
  private directorFactory: DirectorFactory;
  private actorFactory: ActorFactory;

  constructor(module: TestingModule) {
    super();
    this.repository = module.get<MovieRepository>(MovieRepository);
    this.directorFactory = new DirectorFactory(module);
    this.actorFactory = new ActorFactory(module);
  }

  async make(data: Partial<Movie> = {}): Promise<Movie> {
    const directors = await this.directorFactory.makeMany(
      faker.number.int({ min: 1, max: 3 }),
    );
    const actors = await this.actorFactory.makeMany(
      faker.number.int({ min: 1, max: 3 }),
    );

    const movie = new Movie({
      imdbId: (data.imdbId || faker.string.alphanumeric(9)) as string,
      title: (data.title || faker.lorem.words(3)) as string,
      releaseDate: (data.releaseDate ||
        faker.date.past().toISOString().split('T')[0]) as Date,
      rating: (data.rating ||
        faker.number.float({ min: 1, max: 9, fractionDigits: 1 })) as number,
      directors,
      actors,
    });

    // Ensure rating is between 0 and 10, faker-js can generate values outside this range sometimes
    if (movie.rating < 0) {
      movie.rating = 0.0;
    }
    if (movie.rating > 10) {
      movie.rating = 10.0;
    }

    return this.repository.create(movie);
  }

  async makeMany(count: number, data: Partial<Movie> = {}): Promise<Movie[]> {
    const movies: Movie[] = [];

    for (let i = 0; i < count; i++) {
      movies.push(await this.make(data));
    }

    return movies;
  }
}
