import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { Factory } from './factory';

import { Director } from '../../src/modules/director/director.entity';
import { DirectorRepository } from '../../src/modules/director/director.repository';

import { PersonFactory } from './person.factory';

export class DirectorFactory extends Factory<Director> {
  private repository: DirectorRepository;
  private personFactory: PersonFactory;

  constructor(module: TestingModule) {
    super();
    this.repository = module.get<DirectorRepository>(DirectorRepository);
    this.personFactory = new PersonFactory(module);
  }

  async make(data: Partial<Director> = {}): Promise<Director> {
    const person = await this.personFactory.make({
      name: (data.person?.name || faker.person.fullName()) as string,
    });

    const director = new Director({
      person,
    });

    return this.repository.create(director);
  }

  async makeMany(
    count: number,
    data: Partial<Director> = {},
  ): Promise<Director[]> {
    const directors: Director[] = [];

    for (let i = 0; i < count; i++) {
      directors.push(await this.make(data));
    }

    return directors;
  }
}
