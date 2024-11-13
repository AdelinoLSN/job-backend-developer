import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMovieReviewDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ maxLength: 255 })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(65_535)
  @ApiProperty({ minLength: 3 })
  @ApiProperty({ maxLength: 65_535 })
  notes: string;
}
