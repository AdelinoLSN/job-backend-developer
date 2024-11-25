import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Person } from './person.entity';
import { PersonFactory } from './person.factory';
import { PersonService } from './person.service';
import { PersonRepository } from './person.repository';
import { TypeOrmPersonRepository } from './typeorm-person.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [],
  providers: [
    PersonFactory,
    PersonService,
    {
      provide: PersonRepository,
      useClass: TypeOrmPersonRepository,
    },
  ],
  exports: [PersonService],
})
export class PersonModule {}
