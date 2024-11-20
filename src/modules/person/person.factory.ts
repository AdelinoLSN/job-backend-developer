import { Injectable } from '@nestjs/common';

import { Person } from './person.entity';

@Injectable()
export class PersonFactory {
  constructor() {}

  create(person: Partial<Person>): Person {
    return new Person({
      name: person.name,
    });
  }
}
