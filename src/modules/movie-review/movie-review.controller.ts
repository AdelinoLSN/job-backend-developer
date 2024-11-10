import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateMovieReviewDto } from './dtos/create-movie-review.dto';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';
import { MovieReviewService } from './movie-review.service';
import { FindManyMovieReviewDto } from './dtos/find-many-movie-review.dto';
import { ParamIdMovieReviewDto } from './dtos/find-one-movie-review.dto';

@Controller('movie-reviews')
export class MovieReviewController {
  constructor(private movieReviewsService: MovieReviewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find movie reviews',
    description:
      'Find movie reviews. You can filter by title, director, or actor. You can also order by releaseDate or rating. And can paginate the results.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie reviews found',
    example: [
      {
        movieReviewId: 1,
        title: 'Inception',
        releaseDate: '2010-07-16T00:00:00.000Z',
        rating: 8.8,
        directors: ['Christopher Nolan'],
        actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
        notes: 'Great movie',
      },
    ],
  })
  async findMany(@Query() findManyMovieReviewDto: FindManyMovieReviewDto) {
    return this.movieReviewsService.findMany(findManyMovieReviewDto);
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a movie review',
    description: 'Find a movie review by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie review found',
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
  async findOne(@Param() paramIdMovieReviewDto: ParamIdMovieReviewDto) {
    return this.movieReviewsService.findOne(paramIdMovieReviewDto.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a movie review',
    description: 'Update a movie review by id',
  })
  @ApiBody({
    type: UpdateMovieReviewDto,
    examples: {
      Inception: {
        value: {
          notes: 'Great movie',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie review updated',
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
  async update(
    @Param() paramIdMovieReviewDto: ParamIdMovieReviewDto,
    @Body() updateMovieReviewDto: UpdateMovieReviewDto,
  ) {
    return this.movieReviewsService.update(
      paramIdMovieReviewDto.id,
      updateMovieReviewDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a movie review',
    description: 'Delete a movie review by id',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Movie review deleted',
  })
  async remove(@Param() paramIdMovieReviewDto: ParamIdMovieReviewDto) {
    return this.movieReviewsService.remove(paramIdMovieReviewDto.id);
  }
}
