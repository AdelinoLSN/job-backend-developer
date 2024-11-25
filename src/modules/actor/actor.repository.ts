import { Actor } from './actor.entity';

export abstract class ActorRepository {
  abstract findOneByPersonId(personId: number): Promise<Actor>;
  abstract create(actor: Actor): Promise<Actor>;
}
