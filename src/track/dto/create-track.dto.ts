import { IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  readonly name: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly artistId: string | null;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly albumId: string | null;

  @IsNumber()
  readonly duration: number;
}
