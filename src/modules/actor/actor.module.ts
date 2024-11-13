import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Actor } from './actor.entity';
import { ActorService } from './actor.service';
import { ActorRepository } from './actor.repository';

import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), PersonModule],
  controllers: [],
  providers: [ActorService, ActorRepository],
  exports: [ActorService],
})
export class ActorModule {}
