import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class OpenMovieDatabaseRequestException extends HttpException {
  constructor(error: HttpExceptionOptions) {
    super(
      'Error while fetching data from provider Open Movie Database',
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
