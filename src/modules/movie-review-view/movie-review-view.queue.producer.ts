import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MovieReviewViewQueueProducer {
  constructor(@InjectQueue('movie-review-view') private queue: Queue) {}

  async addIncrementCountJob(movieReviewId: number) {
    this.queue.add('increment', { movieReviewId });
  }
}
