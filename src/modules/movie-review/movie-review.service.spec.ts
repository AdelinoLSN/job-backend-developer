import { Test, TestingModule } from '@nestjs/testing';

import { MovieReviewService } from './movie-review.service';
import { MovieReviewRepository } from './movie-review.repository';

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

      const movieReviewsResponse = movieReviews.map((movieReview) => ({
        movieReviewId: movieReview.id,
        title: movieReview.movie.title,
        releaseDate: movieReview.movie.releaseDate,
        rating: movieReview.movie.rating,
        directors: movieReview.movie.directors.map(
          (director) => director.person.name,
        ),
        actors: movieReview.movie.actors.map((actor) => actor.person.name),
        notes: movieReview.notes,
      }));

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

      const movieReviewResponse = {
        movieReviewId: movieReview.id,
        title: movieReview.movie.title,
        releaseDate: movieReview.movie.releaseDate,
        rating: movieReview.movie.rating,
        directors: movieReview.movie.directors.map(
          (director) => director.person.name,
        ),
        actors: movieReview.movie.actors.map((actor) => actor.person.name),
        notes: movieReview.notes,
      };

      jest.spyOn(movieService, 'findByTitleOrCreate').mockResolvedValue(movie);

      jest
        .spyOn(movieReviewRepository, 'create')
        .mockResolvedValue(movieReview);

      const result = await movieReviewService.create(movieReviewDto);

      expect(result).toEqual(movieReviewResponse);
    });
  });
});
