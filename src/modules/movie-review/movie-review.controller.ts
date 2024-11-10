import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { MovieReviewService } from './movie-review.service';

@Controller('movie-reviews')
export class MovieReviewController {
  constructor(private movieReviewsService: MovieReviewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findMany() {
    return this.movieReviewsService.findMany();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a movie review',
    description: 'Create a movie review',
  })
  @ApiBody({
    type: CreateMovieReviewDto,
    examples: {
      Inception: {
        value: {
          title: 'Inception',
          notes: 'Great movie',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movie review created',
    example: {
      movieReviewId: 1,
      title: 'Inception',
      releaseDate: '2010-07-16T00:00:00.000Z',
      rating: 8.8,
      directors: ['Christopher Nolan'],
      actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
      notes: 'Great movie',
    },
  })
  async create(@Body() createMovieReviewDto: CreateMovieReviewDto) {
    return this.movieReviewsService.create(createMovieReviewDto);
  }
}
