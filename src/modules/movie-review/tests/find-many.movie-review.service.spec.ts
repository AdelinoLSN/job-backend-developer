import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieReviewService } from '../movie-review.service';
import { MovieReviewRepository } from '../movie-review.repository';

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
            findMany: jest.fn(),
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

  describe('findMany', () => {
    it('should return an empty array if there are no movie reviews', async () => {
      const findManyMovieReviewDto = {};

      jest.spyOn(movieReviewRepository, 'findMany').mockResolvedValue([]);

      const result = await movieReviewService.findMany(findManyMovieReviewDto);

      expect(result).toEqual([]);
    });

    it('should return all movie reviews formatted', async () => {
      const movieReviews = Array.from(
        { length: faker.number.int({ min: 1, max: 10 }) },
        () => ({
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
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      jest
        .spyOn(movieReviewRepository, 'findMany')
        .mockResolvedValue(movieReviews);

      const findManyMovieReviewDto = {};

      const result = await movieReviewService.findMany(findManyMovieReviewDto);

      expect(result).toEqual(
        movieReviews.map((movieReview) => ({
          id: movieReview.id,
          notes: movieReview.notes,
          movie: {
            id: movieReview.movie.id,
            imdbId: movieReview.movie.imdbId,
            title: movieReview.movie.title,
            releaseDate: movieReview.movie.releaseDate,
            rating: movieReview.movie.rating,
            directors: movieReview.movie.directors.map((director) => ({
              id: director.id,
              person: {
                id: director.person.id,
                name: director.person.name,
              },
            })),
            actors: movieReview.movie.actors.map((actor) => ({
              id: actor.id,
              person: {
                id: actor.person.id,
                name: actor.person.name,
              },
            })),
            createdAt: movieReview.movie.createdAt,
            updatedAt: movieReview.movie.updatedAt,
          },
          createdAt: movieReview.createdAt,
          updatedAt: movieReview.updatedAt,
          deletedAt: movieReview.deletedAt,
        })),
      );
    });
  });
});
