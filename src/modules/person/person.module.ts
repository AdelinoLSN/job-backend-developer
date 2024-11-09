import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Person } from './person.entity';
import { PersonService } from './person.service';
import { PersonRepository } from './person.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [],
  providers: [PersonService, PersonRepository],
  exports: [PersonService],
})
export class PersonModule {}
