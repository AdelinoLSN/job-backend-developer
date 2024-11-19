import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { OpenMovieDatabaseProvider } from '../open-movie-database.provider';

import { MovieNotFoundException } from '../../../common/exceptions/movie-not-found-exception.filter';
import { MovieDatabaseMovieDetails } from '../types/movie-database-movie-details.types';
import { OpenMovieDatabaseRequestException } from '../../../common/exceptions/open-movie-database-request-exception.filter';

describe('OpenMovieDatabaseProvider', () => {
  let openMovieDatabaseProvider: OpenMovieDatabaseProvider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OpenMovieDatabaseProvider,
          useValue: {
            fetchData: jest.fn(),
            searchById: new OpenMovieDatabaseProvider().searchById,
          },
        },
      ],
    }).compile();

    openMovieDatabaseProvider = module.get<OpenMovieDatabaseProvider>(
      OpenMovieDatabaseProvider,
    );
  });

  describe('searchById', () => {
    it('should return movie details from Open Movie Database', async () => {
      const idToSearch = faker.string.alphanumeric(9);
      const movieDetails: MovieDatabaseMovieDetails = {
        Title: faker.book.title(),
        Released: faker.date.past().toISOString(),
        Director: faker.person.fullName(),
        Actors: Array.from({ length: 3 }, () => faker.person.fullName()).join(
          ', ',
        ),
        imdbID: idToSearch,
        imdbRating: faker.number.bigInt({ min: 1, max: 10 }).toString(),
      };

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockResolvedValue(movieDetails);

      const result = await openMovieDatabaseProvider.searchById(idToSearch);

      expect(result).toEqual(movieDetails);
    });

    it('should throw MovieNotFoundException when no movie is found', async () => {
      const idToSearch = faker.string.alphanumeric(9);

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockResolvedValue({ Error: 'Movie not found!' });

      const result = openMovieDatabaseProvider.searchById(idToSearch);

      expect(result).rejects.toThrow(MovieNotFoundException);
    });

    it('should throw OpenMovieDatabaseRequestException when an error occurs', async () => {
      const idToSearch = faker.string.alphanumeric(9);

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockRejectedValue(
          new OpenMovieDatabaseRequestException(new Error() as any),
        );

      const result = openMovieDatabaseProvider.searchById(idToSearch);

      expect(result).rejects.toThrow(OpenMovieDatabaseRequestException);
    });
  });
});
