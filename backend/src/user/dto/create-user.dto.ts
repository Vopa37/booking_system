import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthday: Date | string;
  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
