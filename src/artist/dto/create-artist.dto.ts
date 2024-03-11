import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateArtistDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly grammy: boolean;
}
