import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { MovieReviewService } from './movie-review.service';

@Controller('movie-reviews')
export class MovieReviewController {
  constructor(private movieReviewsService: MovieReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMovieReviewDto: CreateMovieReviewDto) {
    return this.movieReviewsService.create(createMovieReviewDto);
  }
}
