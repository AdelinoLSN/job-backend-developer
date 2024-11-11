import { TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { Factory } from './factory';

import { Actor } from '../../src/modules/actor/actor.entity';
import { ActorRepository } from '../../src/modules/actor/actor.repository';

import { PersonFactory } from './person.factory';

export class ActorFactory extends Factory<Actor> {
  private repository: ActorRepository;
  private personFactory: PersonFactory;

  constructor(module: TestingModule) {
    super();
    this.repository = module.get<ActorRepository>(ActorRepository);
    this.personFactory = new PersonFactory(module);
  }

  async make(data: Partial<Actor> = {}): Promise<Actor> {
    const person = await this.personFactory.make({
      name: (data.person?.name || faker.person.fullName()) as string,
    });

    const actor = new Actor({
      person,
    });

    return this.repository.create(actor);
  }

  async makeMany(count: number, data: Partial<Actor> = {}): Promise<Actor[]> {
    const actors: Actor[] = [];

    for (let i = 0; i < count; i++) {
      actors.push(await this.make(data));
    }

    return actors;
  }
}
