import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Person } from '../person/person.entity';

@Entity()
export class Director {
  constructor(partial: Partial<Director>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person)
  @JoinColumn()
  person: Person;
}
