import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Person } from './person.entity';

@Injectable()
export class PersonRepository {
  constructor(
    @InjectRepository(Person) private repository: Repository<Person>,
  ) {}

  async findOneByName(name: string): Promise<Person> {
    return await this.repository.findOne({ where: { name } });
  }
}
