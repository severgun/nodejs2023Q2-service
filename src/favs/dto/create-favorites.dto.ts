import { IsArray, IsUUID } from 'class-validator';

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
