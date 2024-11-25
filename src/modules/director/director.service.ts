import { Inject, Injectable } from '@nestjs/common';

import { Director } from './director.entity';
import { DirectorFactory } from './director.factory';
import { DirectorRepository } from './director.repository';

import { PersonService } from '../person/person.service';

@Injectable()
export class DirectorService {
  constructor(
    @Inject(DirectorFactory) private directorFactory: DirectorFactory,
    @Inject(DirectorRepository) private directorRepository: DirectorRepository,
    @Inject(PersonService) private personService: PersonService,
  ) {}

  async findManyByNameOrCreate(names: string[]): Promise<Director[]> {
    const people = await this.personService.findManyByNameOrCreate(names);

    const directors = await Promise.all(
      people.map(async (person) => {
        const directorAlreadyExists =
          await this.directorRepository.findOneByPersonId(person.id);

        if (directorAlreadyExists) {
          return directorAlreadyExists;
        }

        const director = this.directorFactory.create({ person });

        return await this.directorRepository.create(director);
      }),
    );

    return directors;
  }
}
