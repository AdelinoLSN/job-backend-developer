import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

import { MovieReview } from './modules/movie-review/movie-review.entity';
import { Movie } from './modules/movie/movie.entity';
import { Director } from './modules/director/director.entity';
import { Actor } from './modules/actor/actor.entity';
import { Person } from './modules/person/person.entity';

import { MovieReviewView } from './modules/movie-review-view/movie-review-view.entity';
import { MovieReviewModule } from './modules/movie-review/movie-review.module';
import { MovieReviewViewModule } from './modules/movie-review-view/movie-review-view.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [MovieReview, Movie, Director, Actor, Person, MovieReviewView],
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
      },
    }),
    ScheduleModule.forRoot(),
    MovieReviewModule,
    MovieReviewViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
