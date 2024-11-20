import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { MovieService } from '../movie.service';
import { MovieRepository } from '../movie.repository';
import { MultipleMoviesFoundException } from '../../../common/exceptions/multiple-movies-found-exception.filter';

import { MovieDatabaseService } from '../../movie-database/movie-database.service';
import { DirectorService } from '../../director/director.service';
import { ActorService } from '../../actor/actor.service';
import { Movie } from '../movie.entity';
import { MovieDatabaseMovie } from '../../movie-database/types/movie-database-movie.types';

describe(MovieService.name, () => {
  let movieService: MovieService;
  let movieDatabaseService: MovieDatabaseService;
  let movieRepository: MovieRepository;
  let directorService: DirectorService;
  let actorService: ActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            findOneByTitle: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: MovieDatabaseService,
          useValue: {
            searchMoviesByTitle: jest.fn(),
            searchMovieById: jest.fn(),
          },
        },
        {
          provide: DirectorService,
          useValue: {
            findManyByNameOrCreate: jest.fn(),
          },
        },
        {
          provide: ActorService,
          useValue: {
            findManyByNameOrCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieDatabaseService =
      module.get<MovieDatabaseService>(MovieDatabaseService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    directorService = module.get<DirectorService>(DirectorService);
    actorService = module.get<ActorService>(ActorService);
  });

  describe('findByTitleOrCreate', () => {
    it('should return movie from database when the movie exists in database', async () => {
      const title = faker.book.title();
      const movie = new Movie({
        id: faker.number.int(),
        imdbId: faker.string.alphanumeric(9),
        title: title,
        releaseDate: faker.date.past(),
        rating: faker.number.float({ min: 1, max: 10 }),
        directors: [],
        actors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(movie);

      const result = await movieService.findByTitleOrCreate(title);

      expect(result).toEqual(movie);
    });

    it('should create movie when the movie does not exist in database', async () => {
      const title = faker.book.title();
      const movieDatabaseMovie: MovieDatabaseMovie = {
        Title: faker.book.title(),
        imdbID: faker.string.alphanumeric(9),
        Year: faker.date.past().getFullYear().toString(),
        Type: 'movie',
      };
      const movieDatabaseMovies: MovieDatabaseMovie[] = [movieDatabaseMovie];
      const movieDatabaseMovieDetail = {
        imdbID: movieDatabaseMovie.imdbID,
        Title: movieDatabaseMovie.Title,
        Released: '16 Jul 2010',
        imdbRating: faker.number.float({ min: 1, max: 10 }).toString(),
        Director: faker.person.fullName(),
        Actors: Array.from({ length: 3 }, () => faker.person.fullName()).join(
          ', ',
        ),
      };

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(null);
      jest
        .spyOn(movieDatabaseService, 'searchMoviesByTitle')
        .mockResolvedValue(movieDatabaseMovies);
      jest
        .spyOn(movieDatabaseService, 'searchMovieById')
        .mockResolvedValue(movieDatabaseMovieDetail);
      jest
        .spyOn(directorService, 'findManyByNameOrCreate')
        .mockResolvedValue([]);
      jest.spyOn(actorService, 'findManyByNameOrCreate').mockResolvedValue([]);
      jest.spyOn(movieRepository, 'create').mockResolvedValue({
        id: 1,
        imdbId: movieDatabaseMovieDetail.imdbID,
        title: movieDatabaseMovieDetail.Title,
        releaseDate: new Date(movieDatabaseMovieDetail.Released),
        rating: parseFloat(movieDatabaseMovieDetail.imdbRating),
        directors: [],
        actors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await movieService.findByTitleOrCreate(title);

      expect(result).toEqual({
        id: 1,
        imdbId: movieDatabaseMovieDetail.imdbID,
        title: movieDatabaseMovieDetail.Title,
        releaseDate: expect.any(Date),
        rating: parseFloat(movieDatabaseMovieDetail.imdbRating),
        directors: [],
        actors: [],
      });
    });

    it('should throw MultipleMoviesFoundException if multiple movies are found with different titles and does not exist on database', async () => {
      const movieTitlePrefix = faker.lorem.word();
      const movieDatabaseMovies: MovieDatabaseMovie[] = Array.from(
        { length: 2 },
        () => ({
          Title: `${movieTitlePrefix} ${faker.number.int()}`,
          imdbID: faker.string.alphanumeric(9),
          Year: faker.date.past().getFullYear().toString(),
          Type: 'movie',
        }),
      );

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(null);

      jest
        .spyOn(movieDatabaseService, 'searchMoviesByTitle')
        .mockResolvedValue(movieDatabaseMovies);

      await expect(
        movieService.findByTitleOrCreate(movieTitlePrefix),
      ).rejects.toThrow(MultipleMoviesFoundException);
    });
  });
});
