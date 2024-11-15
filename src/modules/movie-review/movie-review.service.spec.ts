import { Test, TestingModule } from '@nestjs/testing';

import { MovieReviewService } from './movie-review.service';
import { MovieReviewRepository } from './movie-review.repository';
import { MovieReviewResponseDto } from './dtos/movie-review-response.dto';
import { MovieReviewNotFoundException } from '../../common/exceptions/movie-review-not-found-exception.filter';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

import { MovieService } from '../movie/movie.service';

describe(MovieReviewService.name, () => {
  let movieReviewService: MovieReviewService;
  let movieReviewRepository: MovieReviewRepository;
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieReviewService,
        {
          provide: MovieReviewRepository,
          useValue: {
            findMany: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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

  describe('findMany', () => {
    it('should return an empty array if there are no movie reviews', async () => {
      const findManyMovieReviewDto = {};

      jest.spyOn(movieReviewRepository, 'findMany').mockResolvedValue([]);

      const result = await movieReviewService.findMany(findManyMovieReviewDto);

      expect(result).toEqual([]);
    });

    it('should return all movie reviews', async () => {
      const findManyMovieReviewDto = {};
      const movieReviews = [
        {
          id: 1,
          notes: 'Great movie',
          movie: {
            id: 1,
            imdbId: 'tt1375666',
            title: 'Inception',
            releaseDate: new Date('2010-07-16T00:00:00.000Z'),
            rating: 8.8,
            directors: [
              {
                id: 1,
                person: {
                  id: 1,
                  name: 'Christopher Nolan',
                },
              },
            ],
            actors: [
              {
                id: 1,
                person: {
                  id: 1,
                  name: 'Leonardo DiCaprio',
                },
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const movieReviewsResponse = movieReviews.map((movieReview) =>
        MovieReviewResponseDto.fromEntity(movieReview),
      );

      jest
        .spyOn(movieReviewRepository, 'findMany')
        .mockResolvedValue(movieReviews);

      const result = await movieReviewService.findMany(findManyMovieReviewDto);

      expect(result).toEqual(movieReviewsResponse);
    });
  });

  describe('create', () => {
    it('should create a movie review', async () => {
      const movieReviewDto = {
        title: 'Inception',
        notes: 'Great movie',
      };

      const movie = {
        id: 1,
        imdbId: 'tt1375666',
        title: movieReviewDto.title,
        releaseDate: new Date('2010-07-16T00:00:00.000Z'),
        rating: 8.8,
        directors: [
          {
            id: 1,
            person: {
              id: 1,
              name: 'Christopher Nolan',
            },
          },
        ],
        actors: [
          {
            id: 1,
            person: {
              id: 1,
              name: 'Leonardo DiCaprio',
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const movieReview = {
        id: 1,
        notes: movieReviewDto.notes,
        movie,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const movieReviewResponse =
        MovieReviewResponseDto.fromEntity(movieReview);

      jest.spyOn(movieService, 'findByTitleOrCreate').mockResolvedValue(movie);

      jest
        .spyOn(movieReviewRepository, 'create')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.create(movieReviewDto);

      expect(result).toEqual(movieReviewResponse);
    });
  });

  describe('findOne', () => {
    it('should return a movie review', async () => {
      const id = 1;

      const movieReview = {
        id,
        notes: 'Great movie',
        movie: {
          id: 1,
          imdbId: 'tt1375666',
          title: 'Inception',
          releaseDate: new Date('2010-07-16T00:00:00.000Z'),
          rating: 8.8,
          directors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Christopher Nolan',
              },
            },
          ],
          actors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Leonardo DiCaprio',
              },
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const movieReviewResponse =
        MovieReviewResponseDto.fromEntity(movieReview);

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.findOne(id);

      expect(result).toEqual(movieReviewResponse);
    });

    it('should throw MovieReviewNotFoundException if movie review does not exist', async () => {
      const id = 1;

      jest.spyOn(movieReviewRepository, 'findOne').mockResolvedValue(null);

      await expect(movieReviewService.findOne(id)).rejects.toThrow(
        MovieReviewNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a movie review', async () => {
      const id = 1;
      const movieReviewDto: UpdateMovieReviewDto = {
        notes: 'Updated notes',
      };

      const movieReview = {
        id,
        notes: 'Great movie',
        movie: {
          id: 1,
          imdbId: 'tt1375666',
          title: 'Inception',
          releaseDate: new Date('2010-07-16T00:00:00.000Z'),
          rating: 8.8,
          directors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Christopher Nolan',
              },
            },
          ],
          actors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Leonardo DiCaprio',
              },
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const movieReviewResponse = MovieReviewResponseDto.fromEntity({
        ...movieReview,
        notes: movieReviewDto.notes,
      });

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      jest
        .spyOn(movieReviewRepository, 'update')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.update(id, movieReviewDto);

      expect(result).toEqual(movieReviewResponse);
    });

    it('should throw MovieReviewNotFoundException if movie review does not exist', async () => {
      const id = 1;
      const movieReviewDto = {
        notes: 'Great movie',
      };

      jest.spyOn(movieReviewRepository, 'findOne').mockResolvedValue(null);

      await expect(
        movieReviewService.update(id, movieReviewDto),
      ).rejects.toThrow(MovieReviewNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a movie review', async () => {
      const id = 1;

      const movieReview = {
        id,
        notes: 'Great movie',
        movie: {
          id: 1,
          imdbId: 'tt1375666',
          title: 'Inception',
          releaseDate: new Date('2010-07-16T00:00:00.000Z'),
          rating: 8.8,
          directors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Christopher Nolan',
              },
            },
          ],
          actors: [
            {
              id: 1,
              person: {
                id: 1,
                name: 'Leonardo DiCaprio',
              },
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(movieReviewRepository, 'findOne')
        .mockResolvedValue(movieReview);

      jest
        .spyOn(movieReviewRepository, 'update')
        .mockResolvedValue(movieReview);

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
