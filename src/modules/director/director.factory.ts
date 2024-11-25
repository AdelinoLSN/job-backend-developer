import { Injectable } from '@nestjs/common';
import { Director } from './director.entity';

@Injectable()
export class DirectorFactory {
  constructor() {}

  create(director: Partial<Director>): Director {
    return new Director({
      person: director.person,
    });
  }
}
