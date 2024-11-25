import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieReview } from '../movie-review.entity';
import { MovieReviewFactory } from '../movie-review.factory';
import { MovieReviewService } from '../movie-review.service';
import { MovieReviewRepository } from '../movie-review.repository';
import { UpdateMovieReviewDto } from '../dtos/update-movie-review.dto';
import { MovieReviewNotFoundException } from '../../../common/exceptions/movie-review-not-found-exception.filter';

import { MovieService } from '../../movie/movie.service';

describe('MovieReviewService', () => {
  let movieReviewService: MovieReviewService;
  let movieReviewRepository: MovieReviewRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieReviewFactory,
        MovieReviewService,
        {
          provide: MovieReviewRepository,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: MovieService,
          useValue: {},
        },
      ],
    }).compile();

    movieReviewService = module.get<MovieReviewService>(MovieReviewService);
    movieReviewRepository = module.get<MovieReviewRepository>(
      MovieReviewRepository,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update a movie review', async () => {
      const id = faker.number.int();
      const updateMovieReviewDto: UpdateMovieReviewDto = {
        notes: faker.lorem.sentence(),
      };

      const movieReview: MovieReview = {
        id,
        notes: faker.lorem.sentence(),
        movie: {
          id: faker.number.int(),
          imdbId: faker.string.alphanumeric(9),
          title: faker.book.title(),
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
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      };

      const movieReviewResponse = {
        ...movieReview,
        notes: updateMovieReviewDto.notes,
      };

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      jest
        .spyOn(movieReviewRepository, 'update')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.update(id, updateMovieReviewDto);

      expect(result).toEqual(movieReviewResponse);
    });
  });

  it('should throw MovieReviewNotFoundException if movie review does not exist', async () => {
    const id = faker.number.int();
    const updateMovieReviewDto = {
      notes: faker.lorem.sentence(),
    };

    jest.spyOn(movieReviewRepository, 'findOne').mockResolvedValue(null);

    await expect(
      movieReviewService.update(id, updateMovieReviewDto),
    ).rejects.toThrow(MovieReviewNotFoundException);
  });
});
