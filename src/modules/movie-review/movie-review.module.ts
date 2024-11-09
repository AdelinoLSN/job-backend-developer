import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieReview } from './movie-review.entity';
import { MovieReviewController } from './movie-review.controller';
import { MovieReviewService } from './movie-review.service';
import { MovieReviewRepository } from './movie-review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MovieReview])],
  controllers: [MovieReviewController],
  providers: [MovieReviewService, MovieReviewRepository],
})
export class MovieReviewModule {}
