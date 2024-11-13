import { Module } from '@nestjs/common';

import { OmdbService } from './omdb.service';
import { OmdbProvider } from './omdb.provider';

@Module({
  imports: [],
  providers: [OmdbService, OmdbProvider],
  controllers: [],
  exports: [OmdbService],
})
export class OmdbModule {}
