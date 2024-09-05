import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsArray, IsOptional } from 'class-validator';

export class GetEventsByCategoriesDto {
  @ApiProperty()
  @IsArray()
  @Transform(({ value }) => value.map(Number)) // Transformace pole řetězců na pole čísel
  @IsNumber(
    {},
    { each: true, message: 'Každá položka seznamu kategorií musí být číslo' },
  )
  categories: number[];

  @ApiProperty()
  @Transform((x) => Number(x.value))
  @IsNumber()
  @IsOptional()
  createdBy: number;
}
