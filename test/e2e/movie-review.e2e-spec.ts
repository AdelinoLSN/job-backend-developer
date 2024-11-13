import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { DatabaseHelper } from '../helpers/database.helper';

import { MovieReviewModule } from '../../src/modules/movie-review/movie-review.module';
import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { MovieReviewFactory } from '../factories/movie-review.factory';
import { CreateMovieReviewDto } from 'src/modules/movie-review/dtos/create-movie-review.dto';
import { UpdateMovieReviewDto } from '../../src/modules/movie-review/dtos/update-movie-review.dto';
import { Movie } from '../../src/modules/movie/movie.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Person } from '../../src/modules/person/person.entity';
import { OmdbProvider } from '../../src/modules/omdb/omdb.provider';
import { OmdbMovie } from 'src/modules/omdb/interfaces/omdb-movie.interface';
import { OmdbMovieDetailed } from 'src/modules/omdb/interfaces/omdb-movie-detailed.interface';

describe(`${MovieReview.name} (e2e)`, () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let omdbProvider: OmdbProvider;
  let databaseName: string;
  let factory: MovieReviewFactory;

  beforeAll(async () => {
    databaseName = 'movie_review_test_' + new Date().getTime();

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
      .overrideProvider(OmdbProvider)
      .useValue({
        searchByTitle: jest.fn(),
        searchById: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    omdbProvider = module.get<OmdbProvider>(OmdbProvider);

    dataSource = module.get<DataSource>(DataSource);

    factory = new MovieReviewFactory(module);
  });

  beforeEach(async () => {
    await DatabaseHelper.cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await DatabaseHelper.dropDatabase(dataSource, databaseName);

    await app.close();
  });

  describe('GET /movie-reviews', () => {
    it('should return an empty array of movie reviews', () => {
      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect([]);
    });

    it('should return an array of movie reviews', async () => {
      const movieReviews = await factory.makeMany(3);

      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(
            movieReviews.map((movieReview) => ({
              movieReviewId: movieReview.id,
              title: movieReview.movie.title,
              releaseDate: movieReview.movie.releaseDate,
              rating: movieReview.movie.rating,
              directors: movieReview.movie.directors.map(
                (director) => director.person.name,
              ),
              actors: movieReview.movie.actors.map(
                (actor) => actor.person.name,
              ),
              notes: movieReview.notes,
            })),
          );
        });
    });

    it('should return an empty array of movie reviews when the unique movie review is deleted', async () => {
      const movieReview = await factory.make();

      await factory.softDelete(movieReview.id);

      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect([]);
    });
  });

  describe('POST /movie-reviews', () => {
    it('should create a movie review', () => {
      const searchByTitleMock: OmdbMovie[] = [
        {
          Title: faker.book.title(),
          Year: faker.date.past().getFullYear().toString(),
          imdbID: faker.string.alphanumeric(9),
          Type: 'movie',
        },
      ];

      const searchByIdMock: OmdbMovieDetailed = {
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
        .spyOn(omdbProvider, 'searchByTitle')
        .mockResolvedValue(searchByTitleMock);

      jest.spyOn(omdbProvider, 'searchById').mockResolvedValue(searchByIdMock);

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
      const movieReview = await factory.make();

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
            releaseDate: movieReview.movie.releaseDate,
            rating: movieReview.movie.rating,
            directors: movieReview.movie.directors.map(
              (director) => director.person.name,
            ),
            actors: movieReview.movie.actors.map((actor) => actor.person.name),
            notes: createMovieReviewDto.notes,
          });
        });
    });

    it('should return a 409 error when trying to create a movie with a non full title and more than one result is found', () => {
      const radicalTitle = faker.lorem.word();
      const searchByTitleMock: OmdbMovie[] = [
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
        .spyOn(omdbProvider, 'searchByTitle')
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
      const searchByTitleMock: OmdbMovie[] = [
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

      const searchByIdMock: OmdbMovieDetailed = {
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
        .spyOn(omdbProvider, 'searchByTitle')
        .mockResolvedValue(searchByTitleMock);

      jest.spyOn(omdbProvider, 'searchById').mockResolvedValue(searchByIdMock);

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

  describe('GET /movie-reviews/:id', () => {
    it('should return a movie review', async () => {
      const movieReview = await factory.make();

      return request(app.getHttpServer())
        .get(`/movie-reviews/${movieReview.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            movieReviewId: movieReview.id,
            title: movieReview.movie.title,
            releaseDate: movieReview.movie.releaseDate,
            rating: movieReview.movie.rating,
            directors: expect.arrayContaining(
              movieReview.movie.directors.map(
                (director) => director.person.name,
              ),
            ),
            actors: expect.arrayContaining(
              movieReview.movie.actors.map((actor) => actor.person.name),
            ),
            notes: movieReview.notes,
          });
        });
    });

    it('should return a 404 error when the movie review does not exist', () => {
      const movieReviewId = faker.number.int();

      return request(app.getHttpServer())
        .get(`/movie-reviews/${movieReviewId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Movie review with id "${movieReviewId}" not found`,
          });
        });
    });
  });

  describe('PATCH /movie-reviews/:id', () => {
    it('should update a movie review', async () => {
      const movieReview = await factory.make();
      const updateMovieReviewDto: UpdateMovieReviewDto = {
        notes: faker.lorem.paragraph(),
      };

      return request(app.getHttpServer())
        .patch(`/movie-reviews/${movieReview.id}`)
        .send(updateMovieReviewDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            movieReviewId: movieReview.id,
            title: movieReview.movie.title,
            releaseDate: movieReview.movie.releaseDate,
            rating: movieReview.movie.rating,
            directors: expect.arrayContaining(
              movieReview.movie.directors.map(
                (director) => director.person.name,
              ),
            ),
            actors: expect.arrayContaining(
              movieReview.movie.actors.map((actor) => actor.person.name),
            ),
            notes: updateMovieReviewDto.notes,
          });
        });
    });

    it('should return a 404 error when the movie review does not exist', () => {
      const movieReviewId = faker.number.int();
      const updateMovieReviewDto: UpdateMovieReviewDto = {
        notes: faker.lorem.paragraph(),
      };

      return request(app.getHttpServer())
        .patch(`/movie-reviews/${movieReviewId}`)
        .send(updateMovieReviewDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Movie review with id "${movieReviewId}" not found`,
          });
        });
    });
  });

  describe('DELETE /movie-reviews/:id', () => {
    it('should delete a movie review', async () => {
      const movieReview = await factory.make();

      await request(app.getHttpServer())
        .delete(`/movie-reviews/${movieReview.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect({});

      const findOne = await factory.findOne(movieReview.id);

      expect(findOne).toBeNull();
    });

    it('should return a 404 error when the movie review does not exist', () => {
      const movieReviewId = faker.number.int();

      return request(app.getHttpServer())
        .delete(`/movie-reviews/${movieReviewId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Movie review with id "${movieReviewId}" not found`,
          });
        });
    });
  });
});
