import { IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly password: string;
}
