import { Inject, Injectable } from '@nestjs/common';

import { Person } from './person.entity';
import { PersonRepository } from './person.repository';

@Injectable()
export class PersonService {
  constructor(@Inject() private personRepository: PersonRepository) {}

  async findManyByNameOrCreate(names: string[]): Promise<Person[]> {
    const persons = await Promise.all(
      names.map(async (name) => {
        const personAlreadyExists =
          await this.personRepository.findOneByName(name);

        if (personAlreadyExists) {
          return personAlreadyExists;
        }

        const person = new Person({ name });

        return await this.personRepository.create(person);
      }),
    );

    return persons;
  }
}
