import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieReviewService } from '../movie-review.service';
import { MovieReviewRepository } from '../movie-review.repository';

import { ParamIdMovieReviewDto } from '../dtos/find-one-movie-review.dto';
import { MovieReviewNotFoundException } from '../../../common/exceptions/movie-review-not-found-exception.filter';

import { MovieService } from '../../movie/movie.service';

describe('MovieReviewService', () => {
  let movieReviewService: MovieReviewService;
  let movieReviewRepository: MovieReviewRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieReviewService,
        {
          provide: MovieReviewRepository,
          useValue: {
            findOne: jest.fn(),
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

  describe('findOne', () => {
    it('should return a movie review', async () => {
      const movieReview = {
        id: faker.number.int(),
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

      const findOneMovieReviewDto: ParamIdMovieReviewDto = {
        id: movieReview.id,
      };

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.findOne(findOneMovieReviewDto.id);

      expect(result).toEqual(movieReview);
    });
  });

  it('should throw MovieReviewNotFoundException when no movie review is found', async () => {
    const id = faker.number.int();

    jest.spyOn(movieReviewRepository, 'findOne').mockResolvedValue(null);

    const result = movieReviewService.findOne(id);

    expect(result).rejects.toThrow(MovieReviewNotFoundException);
  });
});
