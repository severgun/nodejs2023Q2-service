import { UserNoPassword } from 'src/user/interfaces/user-no-password.interface';
import { User } from 'src/user/interfaces/user.interface';

export const filterOutPassword = (user: User): UserNoPassword => {
  delete user.password;

  return user;
};
