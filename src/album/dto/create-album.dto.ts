import { IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly year: number;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly artistId: string | null;
}
