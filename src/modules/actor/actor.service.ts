import { Inject, Injectable } from '@nestjs/common';

import { Actor } from './actor.entity';
import { ActorFactory } from './actor.factory';
import { ActorRepository } from './actor.repository';

import { PersonService } from '../person/person.service';

@Injectable()
export class ActorService {
  constructor(
    @Inject(ActorFactory) private actorFactory: ActorFactory,
    @Inject(ActorRepository) private actorRepository: ActorRepository,
    @Inject(PersonService) private personService: PersonService,
  ) {}

  async findManyByNameOrCreate(names: string[]): Promise<Actor[]> {
    const people = await this.personService.findManyByNameOrCreate(names);

    const actors = await Promise.all(
      people.map(async (person) => {
        const actorAlreadyExists = await this.actorRepository.findOneByPersonId(
          person.id,
        );

        if (actorAlreadyExists) {
          return actorAlreadyExists;
        }

        const actor = this.actorFactory.create({ person });

        return await this.actorRepository.create(actor);
      }),
    );

    return actors;
  }
}
