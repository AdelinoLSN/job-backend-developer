import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class FindManyMovieReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;
}
