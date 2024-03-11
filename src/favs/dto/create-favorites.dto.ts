import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateFavoritesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  readonly artists: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  readonly albums: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  readonly tracks: string[];
}
