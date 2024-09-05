import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Currency } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateAdmissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @Transform((x) => Number(x.value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
