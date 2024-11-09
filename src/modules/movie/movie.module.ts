import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Movie } from './movie.entity';
import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';

import { OmdbModule } from '../omdb/omdb.module';
import { DirectorModule } from '../director/director.module';
import { ActorModule } from '../actor/actor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    OmdbModule,
    DirectorModule,
    ActorModule,
  ],
  controllers: [],
  providers: [MovieService, MovieRepository],
  exports: [MovieService],
})
export class MovieModule {}
