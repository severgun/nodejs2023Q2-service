import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID()
  readonly userId: string;

  @IsString()
  readonly refreshToken: string;
}
