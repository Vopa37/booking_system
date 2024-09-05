import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateVenueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5)
  postal_code: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
  @ApiProperty()
  @IsString()
  description: string;
}
