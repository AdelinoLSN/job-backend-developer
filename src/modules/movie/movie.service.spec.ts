import { Test, TestingModule } from '@nestjs/testing';

import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';
import { MultipleMoviesFoundException } from '../../common/exceptions/multiple-movies-found-exception.filter';

import { OmdbMovie } from '../omdb/interfaces/omdb-movie.interface';
import { OmdbService } from '../omdb/omdb.service';
import { DirectorService } from '../director/director.service';
import { ActorService } from '../actor/actor.service';

describe(MovieService.name, () => {
  let movieService: MovieService;
  let omdbService: OmdbService;
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
          provide: OmdbService,
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
    omdbService = module.get<OmdbService>(OmdbService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    directorService = module.get<DirectorService>(DirectorService);
    actorService = module.get<ActorService>(ActorService);
  });

  describe('findByTitleOrCreate', () => {
    it('should return movie from database when the movie exists in database', async () => {
      const title = 'Inception';
      const movie = {
        id: 1,
        imdbId: 'tt1375666',
        title: 'Inception',
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        directors: [],
        actors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(movie);

      const result = await movieService.findByTitleOrCreate(title);

      expect(result).toEqual(movie);
    });

    it('should create movie when the movie does not exist in database', async () => {
      const title = 'Inception';
      const omdbMovies: OmdbMovie[] = [
        {
          Title: 'Inception',
          imdbID: 'tt1375666',
          Year: '2010',
          Type: 'movie',
        },
      ];
      const omdbMovieDetailed = {
        imdbID: omdbMovies[0].imdbID,
        Title: omdbMovies[0].Title,
        Released: '16 Jul 2010',
        imdbRating: '8.8',
        Director: 'Christopher Nolan',
        Actors: 'Leonardo DiCaprio',
      };

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(null);
      jest
        .spyOn(omdbService, 'searchMoviesByTitle')
        .mockResolvedValue(omdbMovies);
      jest
        .spyOn(omdbService, 'searchMovieById')
        .mockResolvedValue(omdbMovieDetailed);
      jest
        .spyOn(directorService, 'findManyByNameOrCreate')
        .mockResolvedValue([]);
      jest.spyOn(actorService, 'findManyByNameOrCreate').mockResolvedValue([]);
      jest.spyOn(movieRepository, 'create').mockResolvedValue({
        id: 1,
        imdbId: omdbMovieDetailed.imdbID,
        title: omdbMovieDetailed.Title,
        releaseDate: new Date(omdbMovieDetailed.Released),
        rating: parseFloat(omdbMovieDetailed.imdbRating),
        directors: [],
        actors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await movieService.findByTitleOrCreate(title);

      expect(result).toEqual({
        id: 1,
        imdbId: omdbMovieDetailed.imdbID,
        title: omdbMovieDetailed.Title,
        releaseDate: expect.any(Date),
        rating: parseFloat(omdbMovieDetailed.imdbRating),
        directors: [],
        actors: [],
      });
    });

    it('should throw MultipleMoviesFoundException if multiple movies are found with different titles and does not exist on database', async () => {
      const title = 'Inception';
      const omdbMovies: OmdbMovie[] = [
        {
          Title: 'Inception 1',
          imdbID: 'tt1375666',
          Year: '2010',
          Type: 'movie',
        },
        {
          Title: 'Inception 2',
          imdbID: 'tt0816692',
          Year: '2014',
          Type: 'movie',
        },
      ];

      jest.spyOn(movieRepository, 'findOneByTitle').mockResolvedValue(null);

      jest
        .spyOn(omdbService, 'searchMoviesByTitle')
        .mockResolvedValue(omdbMovies);

      await expect(movieService.findByTitleOrCreate(title)).rejects.toThrow(
        MultipleMoviesFoundException,
      );
    });
  });
});
