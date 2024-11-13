import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { Factory } from './factory';

import { Person } from '../../src/modules/person/person.entity';
import { PersonRepository } from '../../src/modules/person/person.repository';

export class PersonFactory extends Factory<Person> {
  private repository: PersonRepository;

  constructor(module: TestingModule) {
    super();
    this.repository = module.get<PersonRepository>(PersonRepository);
  }

  async make(data: Partial<Person> = {}): Promise<Person> {
    const person: Person = new Person({
      name: (data.name || faker.person.fullName()) as string,
    });

    return this.repository.create(person);
  }

  async makeMany(count: number, data: Partial<Person> = {}): Promise<Person[]> {
    const persons: Person[] = [];

    for (let i = 0; i < count; i++) {
      persons.push(await this.make(data));
    }

    return persons;
  }
}
