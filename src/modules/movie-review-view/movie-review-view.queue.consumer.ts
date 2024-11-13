import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { MovieReviewViewService } from './movie-review-view.service';
import { Job } from 'bullmq';

@Processor('movie-review-view')
export class MovieReviewViewQueueConsumer extends WorkerHost {
  constructor(
    @Inject(MovieReviewViewService)
    private movieReviewViewService: MovieReviewViewService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    await this.movieReviewViewService.increment(job.data.movieReviewId);
  }
}
