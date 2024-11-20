import { faker } from '@faker-js/faker/.';

import { Person } from '../../src/modules/person/person.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Movie } from '../../src/modules/movie/movie.entity';
import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { PersonFactory } from '../../src/modules/person/person.factory';
import { ActorFactory } from '../../src/modules/actor/actor.factory';
import { DirectorFactory } from '../../src/modules/director/director.factory';
import { MovieFactory } from '../../src/modules/movie/movie.factory';
import { MovieReviewFactory } from '../../src/modules/movie-review/movie-review.factory';
import { PersonRepository } from '../../src/modules/person/person.repository';
import { ActorRepository } from '../../src/modules/actor/actor.repository';
import { DirectorRepository } from '../../src/modules/director/director.repository';
import { MovieRepository } from '../../src/modules/movie/movie.repository';
import { MovieReviewRepository } from '../../src/modules/movie-review/movie-review.repository';
import { TestingModule } from '@nestjs/testing';

export class FactoryHelper {
  private personFactory: PersonFactory;
  private actorFactory: ActorFactory;
  private directorFactory: DirectorFactory;
  private movieFactory: MovieFactory;
  private movieReviewFactory: MovieReviewFactory;

  private personRepository: PersonRepository;
  private actorRepository: ActorRepository;
  private directorRepository: DirectorRepository;
  private movieRepository: MovieRepository;
  private movieReviewRepository: MovieReviewRepository;

  constructor(module: TestingModule) {
    this.personFactory = module.get(PersonFactory);
    this.actorFactory = module.get(ActorFactory);
    this.directorFactory = module.get(DirectorFactory);
    this.movieFactory = module.get(MovieFactory);
    this.movieReviewFactory = module.get(MovieReviewFactory);

    this.personRepository = module.get(PersonRepository);
    this.actorRepository = module.get(ActorRepository);
    this.directorRepository = module.get(DirectorRepository);
    this.movieRepository = module.get(MovieRepository);
    this.movieReviewRepository = module.get(MovieReviewRepository);
  }

  async findMovieReview(id: number) {
    return this.movieReviewRepository.findOne(id);
  }

  async createPerson(personData: Partial<Person>) {
    const person = this.personFactory.create({
      name: personData.name || faker.person.fullName(),
    });

    return this.personRepository.create(person);
  }

  async createActor(actorData: Partial<Actor>) {
    const actor = this.actorFactory.create({
      person: actorData.person || (await this.createPerson({})),
    });

    return this.actorRepository.create(actor);
  }

  async createDirector(directorData: Partial<Director>) {
    const director = this.directorFactory.create({
      person: directorData.person || (await this.createPerson({})),
    });

    return this.directorRepository.create(director);
  }

  async createMovie(movieData: Partial<Movie>) {
    const movie = this.movieFactory.create({
      imdbId: movieData.imdbId || faker.string.alphanumeric(9),
      title: movieData.title || faker.book.title(),
      releaseDate: movieData.releaseDate || faker.date.past(),
      rating:
        movieData.rating ||
        faker.number.float({ min: 1, max: 9, fractionDigits: 1 }),
      directors:
        movieData.directors ||
        (await Promise.all(
          Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
            this.createDirector({}),
          ),
        )),
      actors:
        movieData.actors ||
        (await Promise.all(
          Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
            this.createActor({}),
          ),
        )),
    });

    return this.movieRepository.create(movie);
  }

  async createMovieReview(movieReviewData: Partial<MovieReview>) {
    const movieReview = this.movieReviewFactory.create({
      movie: movieReviewData.movie || (await this.createMovie({})),
      notes: movieReviewData.notes || faker.lorem.paragraph(),
    });

    return this.movieReviewRepository.create(movieReview);
  }

  async softDeleteMovieReview(id: number) {
    return this.movieReviewRepository.delete(id);
  }
}
