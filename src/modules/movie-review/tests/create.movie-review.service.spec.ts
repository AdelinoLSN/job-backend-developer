import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieReview } from '../movie-review.entity';
import { MovieReviewFactory } from '../movie-review.factory';
import { MovieReviewService } from '../movie-review.service';
import { MovieReviewRepository } from '../movie-review.repository';
import { CreateMovieReviewDto } from '../dtos/create-movie-review.dto';

import { MovieService } from '../../movie/movie.service';
import { MovieNotFoundException } from '../../../common/exceptions/movie-not-found-exception.filter';
import { OpenMovieDatabaseRequestException } from '../../../common/exceptions/open-movie-database-request-exception.filter';
import { Movie } from '../../movie/movie.entity';

describe('MovieReviewService', () => {
  let movieReviewService: MovieReviewService;
  let movieReviewRepository: MovieReviewRepository;
  let movieService: MovieService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieReviewFactory,
        MovieReviewService,
        {
          provide: MovieReviewRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: MovieService,
          useValue: {
            findByTitleOrCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    movieReviewService = module.get<MovieReviewService>(MovieReviewService);
    movieReviewRepository = module.get<MovieReviewRepository>(
      MovieReviewRepository,
    );
    movieService = module.get<MovieService>(MovieService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a movie review', async () => {
      const createMovieReviewDto: CreateMovieReviewDto = {
        title: faker.book.title(),
        notes: faker.lorem.sentence(),
      };

      const movie: Movie = {
        id: faker.number.int(),
        imdbId: faker.string.alphanumeric(9),
        title: createMovieReviewDto.title,
        releaseDate: faker.date.past(),
        rating: faker.number.float({ min: 1, max: 10 }),
        directors: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => ({
            id: faker.number.int(),
            person: {
              id: faker.number.int(),
              name: faker.person.fullName(),
            },
          }),
        ),
        actors: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => ({
            id: faker.number.int(),
            person: {
              id: faker.number.int(),
              name: faker.person.fullName(),
            },
          }),
        ),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };

      const createMovieReviewResponse = {
        id: faker.number.int(),
        notes: createMovieReviewDto.notes,
        movie,
      };

      const movieReview: MovieReview = {
        ...createMovieReviewResponse,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        deletedAt: null,
      };

      jest.spyOn(movieService, 'findByTitleOrCreate').mockResolvedValue(movie);

      jest
        .spyOn(movieReviewRepository, 'create')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.create(createMovieReviewDto);

      expect(result).toEqual(createMovieReviewResponse);
    });

    it('should throw MovieNotFoundException when no movie is found', async () => {
      const movieReviewDto = {
        title: faker.book.title(),
        notes: faker.lorem.sentence(),
      };

      jest
        .spyOn(movieService, 'findByTitleOrCreate')
        .mockRejectedValue(new MovieNotFoundException());

      await expect(movieReviewService.create(movieReviewDto)).rejects.toThrow(
        MovieNotFoundException,
      );
    });

    it('should throw OpenMovieDatabaseRequestException when Open Movie Database request fails', async () => {
      const movieReviewDto = {
        title: faker.book.title(),
        notes: faker.lorem.sentence(),
      };

      jest
        .spyOn(movieService, 'findByTitleOrCreate')
        .mockRejectedValue(
          new OpenMovieDatabaseRequestException(new Error() as any),
        );

      await expect(movieReviewService.create(movieReviewDto)).rejects.toThrow(
        OpenMovieDatabaseRequestException,
      );
    });
  });
});
