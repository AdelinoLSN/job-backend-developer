import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieReview } from './modules/movie-review/movie-review.entity';
import { Movie } from './modules/movie/movie.entity';
import { Director } from './modules/director/director.entity';
import { Actor } from './modules/actor/actor.entity';
import { Person } from './modules/person/person.entity';

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
      entities: [MovieReview, Movie, Director, Actor, Person],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
