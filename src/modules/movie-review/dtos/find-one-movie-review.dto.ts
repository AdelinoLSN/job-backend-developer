import { IsInt, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ParamIdMovieReviewDto {
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: 'integer', minimum: 1 })
  id: number;
}
