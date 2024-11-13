import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Actor } from './actor.entity';

@Injectable()
export class ActorRepository {
  constructor(@InjectRepository(Actor) private repository: Repository<Actor>) {}

  async findOneByPersonId(personId: number): Promise<Actor> {
    return this.repository.findOne({
      relations: ['person'],
      where: { person: { id: personId } },
    });
  }

  async create(actor: Actor): Promise<Actor> {
    return this.repository.save(actor);
  }
}
