import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DatabaseHelper } from '../helpers/database.helper';

import { MovieReviewModule } from '../../src/modules/movie-review/movie-review.module';
import { MovieReview } from '../../src/modules/movie-review/movie-review.entity';
import { Movie } from '../../src/modules/movie/movie.entity';
import { Director } from '../../src/modules/director/director.entity';
import { Actor } from '../../src/modules/actor/actor.entity';
import { Person } from '../../src/modules/person/person.entity';
import { OmdbProvider } from '../../src/modules/omdb/omdb.provider';

describe(`${MovieReview.name} (e2e)`, () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let databaseName: string;

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
  });

  beforeEach(async () => {
    await DatabaseHelper.cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await DatabaseHelper.dropDatabase(dataSource, databaseName);

    await app.close();
  });
});
