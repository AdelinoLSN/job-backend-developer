import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { MovieReviewView } from './movie-review-view.entity';
import { MovieReviewViewController } from './movie-review-view-controller';
import { MovieReviewViewService } from './movie-review-view.service';
import { MovieReviewViewRepository } from './movie-review-view.repository';
import { MovieReviewModule } from '../movie-review/movie-review.module';
import { MovieReviewViewQueueConsumer } from './movie-review-view.queue.consumer';
import { MovieReviewViewQueueProducer } from './movie-review-view.queue.producer';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieReviewView]),
    forwardRef(() => MovieReviewModule),
    BullModule.registerQueue({
      name: 'movie-review-view',
    }),
  ],
  controllers: [MovieReviewViewController],
  providers: [
    MovieReviewViewService,
    MovieReviewViewRepository,
    MovieReviewViewQueueConsumer,
    MovieReviewViewQueueProducer,
  ],
  exports: [MovieReviewViewService],
})
export class MovieReviewViewModule {}
