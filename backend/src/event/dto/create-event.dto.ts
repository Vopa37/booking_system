import { ApiProperty } from '@nestjs/swagger';
import { CreateAdmissionDto } from '../../admission/dto/admission.create.dto';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayMinSize,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  event_start: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  event_end: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Transform((x) => Number(x.value))
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  @Transform((x) => Number(x.value))
  @IsNumber()
  @IsNotEmpty()
  venue_id: number;

  @ApiProperty()
  @IsArray()
  @Transform(({ value }) => value.map(Number)) // Transformace pole řetězců na pole čísel
  @ArrayMinSize(1, {
    message:
      'Seznam kategorii (categories) musí obsahovat alespoň jednu položku',
  })
  @IsNumber(
    {},
    { each: true, message: 'Každá položka seznamu kategorií musí být číslo' },
  )
  categories: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdmissionDto)
  admissions?: CreateAdmissionDto[];
}
