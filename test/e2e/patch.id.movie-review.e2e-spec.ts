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
import { UpdateMovieReviewDto } from '../../src/modules/movie-review/dtos/update-movie-review.dto';
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

  describe('PATCH /movie-reviews/:id', () => {
    it('should update a movie review', async () => {
      const movieReview = await factory.createMovieReview({});
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
});
