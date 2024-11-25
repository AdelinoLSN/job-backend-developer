import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { DatabaseHelper } from '../helpers/database.helper';
import { FactoryHelper } from '../helpers/factory.helper';

import { MovieReviewModule } from '../../src/modules/movie-review/movie-review.module';
import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { CreateMovieReviewDto } from 'src/modules/movie-review/dtos/create-movie-review.dto';
import { Movie } from '../../src/modules/movie/movie.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Person } from '../../src/modules/person/person.entity';
import { MovieDatabaseProvider } from '../../src/modules/movie-database/movie-database.provider';
import { MovieDatabaseMovie } from '../../src/modules/movie-database/types/movie-database-movie.types';
import { MovieDatabaseMovieDetails } from '../../src/modules/movie-database/types/movie-database-movie-details.types';

jest.setTimeout(20000);

describe(`${MovieReview.name} (e2e)`, () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let movieDatabaseProvider: MovieDatabaseProvider;
  let databaseName: string;
  let factory: FactoryHelper;

  beforeAll(async () => {
    databaseName = 'movie_review_test_' + faker.string.uuid().replace(/-/g, '');

    await DatabaseHelper.createDatabase(databaseName);

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: databaseName,
          entities: [MovieReview, Movie, Director, Actor, Person],
          synchronize: true,
        }),
        BullModule.forRoot({
          connection: {
            url: process.env.REDIS_URL,
          },
        }),
        MovieReviewModule,
      ],
    })
      .overrideProvider(MovieDatabaseProvider)
      .useValue({
        searchByTitle: jest.fn(),
        searchById: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    movieDatabaseProvider = module.get<MovieDatabaseProvider>(
      MovieDatabaseProvider,
    );

    dataSource = module.get<DataSource>(DataSource);

    factory = new FactoryHelper(module);
  });

  beforeEach(async () => {
    await DatabaseHelper.cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await DatabaseHelper.dropDatabase(dataSource, databaseName);

    await app.close();
  });

  describe('POST /movie-reviews', () => {
    it('should create a movie review', () => {
      const searchByTitleMock: MovieDatabaseMovie[] = [
        {
          Title: faker.book.title(),
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
      ];

      const searchByIdMock: MovieDatabaseMovieDetails = {
        imdbID: searchByTitleMock[0].imdbID,
        Title: searchByTitleMock[0].Title,
        Released: '16 Jul 2010',
        Director: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.person.fullName(),
        ).join(', '),
        Actors: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.person.fullName(),
        ).join(', '),
        imdbRating: faker.number
          .float({ min: 0, max: 10, fractionDigits: 1 })
          .toString(),
      };

      const createMovieReviewDto: CreateMovieReviewDto = {
        title: searchByTitleMock[0].Title,
        notes: faker.lorem.paragraph(),
      };

      jest
        .spyOn(movieDatabaseProvider, 'searchByTitle')
        .mockResolvedValue(searchByTitleMock);

      jest
        .spyOn(movieDatabaseProvider, 'searchById')
        .mockResolvedValue(searchByIdMock);

      return request(app.getHttpServer())
        .post('/movie-reviews')
        .send(createMovieReviewDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            movieReviewId: expect.any(Number),
            title: createMovieReviewDto.title,
            releaseDate: new Date(searchByIdMock.Released)
              .toISOString()
              .split('T')[0],
            rating: parseFloat(searchByIdMock.imdbRating),
            directors: expect.arrayContaining(
              searchByIdMock.Director.split(', ').map((director) =>
                director.trim(),
              ),
            ),
            actors: expect.arrayContaining(
              searchByIdMock.Actors.split(', ').map((actor) => actor.trim()),
            ),
            notes: createMovieReviewDto.notes,
          });
        });
    });

    it('should create a movie review for a movie that already exists', async () => {
      const movieReview = await factory.createMovieReview({});

      const createMovieReviewDto: CreateMovieReviewDto = {
        title: movieReview.movie.title,
        notes: faker.lorem.paragraph(),
      };

      return request(app.getHttpServer())
        .post('/movie-reviews')
        .send(createMovieReviewDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            movieReviewId: expect.any(Number),
            title: createMovieReviewDto.title,
            releaseDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            rating: movieReview.movie.rating,
            directors: expect.arrayContaining(
              movieReview.movie.directors.map(
                (director) => director.person.name,
              ),
            ),
            actors: expect.arrayContaining(
              movieReview.movie.actors.map((actor) => actor.person.name),
            ),
            notes: createMovieReviewDto.notes,
          });
        });
    });

    it('should return a 409 error when trying to create a movie with a non full title and more than one result is found', () => {
      const radicalTitle = faker.lorem.word();
      const searchByTitleMock: MovieDatabaseMovie[] = [
        {
          Title: radicalTitle + faker.string.alpha({ length: 5 }),
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
        {
          Title: radicalTitle + faker.book.title(),
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
      ];

      const createMovieReviewDto: CreateMovieReviewDto = {
        title: radicalTitle,
        notes: faker.lorem.paragraph(),
      };

      jest
        .spyOn(movieDatabaseProvider, 'searchByTitle')
        .mockResolvedValue(searchByTitleMock);

      return request(app.getHttpServer())
        .post('/movie-reviews')
        .send(createMovieReviewDto)
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.CONFLICT,
            message: `Multiple movies found for title "${createMovieReviewDto.title}": ${searchByTitleMock.map((movie) => `${movie.Title} (${movie.Year})`).join(', ')}`,
          });
        });
    });

    it('should create a movie review when more than one result is found and the title is fully matched', () => {
      const radicalTitle = faker.lorem.word();
      const searchByTitleMock: MovieDatabaseMovie[] = [
        {
          Title: radicalTitle,
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
        {
          Title: radicalTitle + faker.book.title(),
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
      ];

      const searchByIdMock: MovieDatabaseMovieDetails = {
        imdbID: searchByTitleMock[0].imdbID,
        Title: searchByTitleMock[0].Title,
        Released: '16 Jul 2010',
        Director: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.person.fullName(),
        ).join(', '),
        Actors: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.person.fullName(),
        ).join(', '),
        imdbRating: faker.number
          .float({ min: 0, max: 10, fractionDigits: 1 })
          .toString(),
      };

      const createMovieReviewDto: CreateMovieReviewDto = {
        title: searchByTitleMock[0].Title,
        notes: faker.lorem.paragraph(),
      };

      jest
        .spyOn(movieDatabaseProvider, 'searchByTitle')
        .mockResolvedValue(searchByTitleMock);

      jest
        .spyOn(movieDatabaseProvider, 'searchById')
        .mockResolvedValue(searchByIdMock);

      return request(app.getHttpServer())
        .post('/movie-reviews')
        .send(createMovieReviewDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            movieReviewId: expect.any(Number),
            title: createMovieReviewDto.title,
            releaseDate: new Date(searchByIdMock.Released)
              .toISOString()
              .split('T')[0],
            rating: parseFloat(searchByIdMock.imdbRating),
            directors: expect.arrayContaining(
              searchByIdMock.Director.split(', ').map((director) =>
                director.trim(),
              ),
            ),
            actors: expect.arrayContaining(
              searchByIdMock.Actors.split(', ').map((actor) => actor.trim()),
            ),
            notes: createMovieReviewDto.notes,
          });
        });
    });
  });
});
