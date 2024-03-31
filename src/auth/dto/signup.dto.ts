import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly password: string;
}
