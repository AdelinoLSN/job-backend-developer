import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Actor } from './actor.entity';
import { ActorFactory } from './actor.factory';
import { ActorService } from './actor.service';
import { ActorRepository } from './actor.repository';
import { TypeOrmActorRepository } from './typeorm-actor.repository';

import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), PersonModule],
  controllers: [],
  providers: [
    ActorFactory,
    ActorService,
    {
      provide: ActorRepository,
      useClass: TypeOrmActorRepository,
    },
  ],
  exports: [ActorService],
})
export class ActorModule {}
