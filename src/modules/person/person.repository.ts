import { Person } from './person.entity';

export abstract class PersonRepository {
  abstract findOneByName(name: string): Promise<Person>;
  abstract create(person: Person): Promise<Person>;
}
