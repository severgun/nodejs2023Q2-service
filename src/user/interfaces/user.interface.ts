import { UserNoPassword } from './user-no-password.interface';

export interface User extends UserNoPassword {
  password: string;
}
