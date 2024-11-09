import { Test, TestingModule } from '@nestjs/testing';

import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';

import { OmdbService } from '../omdb/omdb.service';
import { DirectorService } from '../director/director.service';
import { ActorService } from '../actor/actor.service';

describe(MovieService.name, () => {
  let movieService: MovieService;
  let movieRepository: MovieRepository;

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
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it('should return movie from database when calling findByTitleOrCreate with a movie that already exists in database', async () => {
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
});
