import { IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString()
  readonly oldPassword: string;

  @IsString()
  readonly newPassword: string;
}
