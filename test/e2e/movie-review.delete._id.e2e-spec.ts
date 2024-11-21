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

  describe('DELETE /movie-reviews/:id', () => {
    it('should delete a movie review', async () => {
      const movieReview = await factory.createMovieReview({});

      await request(app.getHttpServer())
        .delete(`/movie-reviews/${movieReview.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect({});

      const findOne = await factory.findMovieReview(movieReview.id);

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
