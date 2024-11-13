import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Director } from './director.entity';
import { DirectorService } from './director.service';
import { DirectorRepository } from './director.repository';

import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), PersonModule],
  controllers: [],
  providers: [DirectorService, DirectorRepository],
  exports: [DirectorService],
})
export class DirectorModule {}
