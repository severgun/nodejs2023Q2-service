import { IsString, IsNumber, ValidateIf } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly year: number;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly artistId: string | null;
}
