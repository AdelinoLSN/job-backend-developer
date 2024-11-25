import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Director } from './director.entity';
import { DirectorFactory } from './director.factory';
import { DirectorService } from './director.service';
import { DirectorRepository } from './director.repository';
import { TypeOrmDirectorRepository } from './typeorm-director.repository';

import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), PersonModule],
  controllers: [],
  providers: [
    DirectorFactory,
    DirectorService,
    {
      provide: DirectorRepository,
      useClass: TypeOrmDirectorRepository,
    },
  ],
  exports: [DirectorService],
})
export class DirectorModule {}
