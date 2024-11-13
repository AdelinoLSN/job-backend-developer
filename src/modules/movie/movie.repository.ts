import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository {
  constructor(@InjectRepository(Movie) private repository: Repository<Movie>) {}

  async findMany(limit: number, offset: number): Promise<Movie[]> {
    return await this.repository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOneByTitle(title: string): Promise<Movie | null> {
    return await this.repository.findOne({
      relations: ['directors', 'actors', 'directors.person', 'actors.person'],
      where: { title: title },
    });
  }

  async create(movie: Movie): Promise<Movie> {
    return await this.repository.save(movie);
  }

  async update(movie: Movie): Promise<Movie> {
    return await this.repository.save(movie);
  }
}
