import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UpdateArtistDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly grammy: boolean;
}
