import { Module } from '@nestjs/common';

import { MovieDatabaseService } from './movie-database.service';
import { MovieDatabaseProvider } from './movie-database.provider';
import { OpenMovieDatabaseProvider } from './open-movie-database.provider';

@Module({
  imports: [],
  providers: [
    MovieDatabaseService,
    {
      provide: MovieDatabaseProvider,
      useClass: OpenMovieDatabaseProvider,
    },
  ],
  controllers: [],
  exports: [MovieDatabaseService],
})
export class MovieDatabaseModule {}
