import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { OpenMovieDatabaseProvider } from '../open-movie-database.provider';

import { MovieNotFoundException } from '../../../common/exceptions/movie-not-found-exception.filter';
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
            searchByTitle: new OpenMovieDatabaseProvider().searchByTitle,
          },
        },
      ],
    }).compile();

    openMovieDatabaseProvider = module.get<OpenMovieDatabaseProvider>(
      OpenMovieDatabaseProvider,
    );
  });

  describe('searchByTitle', () => {
    it('should return search results from Open Movie Database', async () => {
      const titleToSearch = faker.book.title();
      const searchResults = [
        {
          Title: titleToSearch,
          imdbID: faker.string.alphanumeric(9),
          Year: faker.date.past().getFullYear().toString(),
          Type: 'movie',
        },
      ];

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockResolvedValue({ Search: searchResults });

      const result =
        await openMovieDatabaseProvider.searchByTitle(titleToSearch);

      expect(result).toEqual(searchResults);
    });

    it('should throw MovieNotFoundException when no movie is found', async () => {
      const titleToSearch = faker.book.title();

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockResolvedValue({ Error: 'Movie not found!' });

      await expect(
        openMovieDatabaseProvider.searchByTitle(titleToSearch),
      ).rejects.toThrow(MovieNotFoundException);
    });

    it('should throw OpenMovieDatabaseRequestException when an error occurs on the provider', async () => {
      const titleToSearch = faker.book.title();

      jest
        .spyOn(openMovieDatabaseProvider, 'fetchData')
        .mockRejectedValue(
          new OpenMovieDatabaseRequestException(new Error() as any),
        );

      await expect(
        openMovieDatabaseProvider.searchByTitle(titleToSearch),
      ).rejects.toThrow(OpenMovieDatabaseRequestException);
    });
  });
});
