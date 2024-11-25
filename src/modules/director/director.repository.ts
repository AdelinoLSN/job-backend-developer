import { Director } from './director.entity';

export abstract class DirectorRepository {
  abstract findOneByPersonId(personId: number): Promise<Director>;
  abstract create(director: Director): Promise<Director>;
}
