import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DatabaseHelper } from '../helpers/database.helper';

import { MovieReviewModule } from '../../src/modules/movie-review/movie-review.module';
import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { MovieReviewFactory } from '../factories/movie-review.factory';
import { Movie } from '../../src/modules/movie/movie.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Person } from '../../src/modules/person/person.entity';
import { OmdbProvider } from '../../src/modules/omdb/omdb.provider';

describe(`${MovieReview.name} (e2e)`, () => {
  let app: INestApplication;
  let dataSource: DataSource;
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
});
