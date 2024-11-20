import { Injectable } from '@nestjs/common';

import { Actor } from './actor.entity';

@Injectable()
export class ActorFactory {
  constructor() {}

  create(actor: Partial<Actor>): Actor {
    return new Actor({
      person: actor.person,
    });
  }
}
