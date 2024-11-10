import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindManyMovieReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({ required: false, minLength: 3, maxLength: 255 })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({ required: false, minLength: 3, maxLength: 255 })
  director?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({ required: false, minLength: 3, maxLength: 255 })
  actor?: string;

  @IsOptional()
  @IsEnum(['releaseDate', 'rating'], {
    message: 'orderBy must be releaseDate or rating',
  })
  @ApiProperty({ required: false, enum: ['releaseDate', 'rating'] })
  orderBy?: 'releaseDate' | 'rating';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false, minimum: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false, minimum: 1 })
  limit?: number;
}
