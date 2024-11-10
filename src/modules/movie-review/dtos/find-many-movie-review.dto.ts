import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindManyMovieReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  director?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  actor?: string;

  @IsOptional()
  @IsEnum(['releaseDate', 'rating'], {
    message: 'orderBy must be releaseDate or rating',
  })
  orderBy?: 'releaseDate' | 'rating';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
  order?: 'ASC' | 'DESC';
}
