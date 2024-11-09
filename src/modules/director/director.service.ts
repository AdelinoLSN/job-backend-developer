import { Inject, Injectable } from '@nestjs/common';

import { Director } from './director.entity';
import { DirectorRepository } from './director.repository';

import { PersonService } from '../person/person.service';

@Injectable()
export class DirectorService {
  constructor(
    @Inject() private directorRepository: DirectorRepository,
    @Inject() private personService: PersonService,
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

        const director = new Director({ person });

        return await this.directorRepository.create(director);
      }),
    );

    return directors;
  }
}
