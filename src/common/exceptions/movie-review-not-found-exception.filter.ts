import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieReviewNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Movie review with id "${id}" not found`, HttpStatus.NOT_FOUND);
  }
}
