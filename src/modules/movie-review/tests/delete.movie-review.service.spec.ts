import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieReviewService } from '../movie-review.service';
import { MovieReviewRepository } from '../movie-review.repository';
import { MovieReviewNotFoundException } from '../../../common/exceptions/movie-review-not-found-exception.filter';

import { MovieService } from '../../movie/movie.service';

describe(MovieReviewService.name, () => {
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
            delete: jest.fn(),
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

  describe('delete', () => {
    it('should delete a movie review', async () => {
      const id = 1;

      const movieReview = {
        id,
        notes: faker.lorem.sentence(),
        movie: {
          id: faker.number.int(),
          imdbId: faker.string.alphanumeric(9),
          title: faker.lorem.words(3),
          releaseDate: faker.date.past(),
          rating: faker.number.float({ min: 1, max: 10 }),
          directors: [
            {
              id: faker.number.int(),
              person: {
                id: faker.number.int(),
                name: faker.person.fullName(),
              },
            },
          ],
          actors: [
            {
              id: faker.number.int(),
              person: {
                id: faker.number.int(),
                name: faker.person.fullName(),
              },
            },
          ],
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        deletedAt: null,
      };

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      jest.spyOn(movieReviewRepository, 'delete').mockResolvedValue();

      const result = await movieReviewService.remove(id);

      expect(result).toEqual(undefined);
    });

    it('should throw MovieReviewNotFoundException if movie review does not exist', async () => {
      const id = 1;

      jest.spyOn(movieReviewRepository, 'findOne').mockResolvedValue(null);

      await expect(movieReviewService.remove(id)).rejects.toThrow(
        MovieReviewNotFoundException,
      );
    });
  });
});
