import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Person } from './person.entity';
import { PersonRepository } from './person.repository';

@Injectable()
export class TypeOrmPersonRepository implements PersonRepository {
  constructor(
    @InjectRepository(Person) private repository: Repository<Person>,
  ) {}

  async findOneByName(name: string): Promise<Person> {
    return this.repository.findOne({ where: { name } });
  }

  async create(person: Person): Promise<Person> {
    return this.repository.save(person);
  }
}
