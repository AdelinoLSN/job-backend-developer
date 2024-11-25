import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Director } from './director.entity';
import { DirectorRepository } from './director.repository';

@Injectable()
export class TypeOrmDirectorRepository implements DirectorRepository {
  constructor(
    @InjectRepository(Director) private repository: Repository<Director>,
  ) {}

  async findOneByPersonId(personId: number): Promise<Director> {
    return this.repository.findOne({
      relations: ['person'],
      where: { person: { id: personId } },
    });
  }

  async create(director: Director): Promise<Director> {
    return this.repository.save(director);
  }
}
