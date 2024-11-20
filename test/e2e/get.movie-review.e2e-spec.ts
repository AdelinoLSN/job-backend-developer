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
import { Movie } from '../../src/modules/movie/movie.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Person } from '../../src/modules/person/person.entity';
import { MovieDatabaseProvider } from '../../src/modules/movie-database/movie-database.provider';

describe(`${MovieReview.name} (e2e)`, () => {
  let app: INestApplication;
  let dataSource: DataSource;
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

  describe('GET /movie-reviews', () => {
    it('should return an empty array of movie reviews', () => {
      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect([]);
    });

    it('should return an array of movie reviews', async () => {
      const movieReviews = await Promise.all(
        Array.from({ length: 3 }, () => factory.createMovieReview({})),
      );

      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(
            movieReviews
              .sort((a, b) => a.id - b.id)
              .map((movieReview) => ({
                movieReviewId: movieReview.id,
                title: movieReview.movie.title,
                releaseDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                rating: movieReview.movie.rating,
                directors: movieReview.movie.directors
                  .sort((a, b) => a.id - b.id)
                  .map((director) => director.person.name),
                actors: movieReview.movie.actors
                  .sort((a, b) => a.id - b.id)
                  .map((director) => director.person.name),
                notes: movieReview.notes,
              })),
          );
        });
    });

    it('should return an empty array of movie reviews when the unique movie review is deleted', async () => {
      const movieReview = await factory.createMovieReview({});

      await factory.softDeleteMovieReview(movieReview.id);

      return request(app.getHttpServer())
        .get('/movie-reviews')
        .expect(HttpStatus.OK)
        .expect([]);
    });
  });
});
