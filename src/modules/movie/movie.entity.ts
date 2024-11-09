import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Director } from '../director/director.entity';
import { Actor } from '../actor/actor.entity';

@Entity()
export class Movie {
  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imdbId: string;

  @Index()
  @Column()
  title: string;

  @Index()
  @Column({ type: 'date' })
  releaseDate: Date;

  @Index()
  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Director)
  @JoinTable({ name: 'movie_director' })
  directors: Director[];

  @ManyToMany(() => Actor)
  @JoinTable({ name: 'movie_actor' })
  actors: Actor[];
}
