import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty()
  @Transform((x) => Number(x.value))
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  text_review: string;
}
