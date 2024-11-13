import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class OmdbProviderRequestException extends HttpException {
  constructor(error: HttpExceptionOptions) {
    super(
      'Error while fetching data from OMDB',
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
