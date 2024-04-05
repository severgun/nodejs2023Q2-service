import { UserNoPassword } from 'src/user/interfaces/user-no-password.interface';
import { User } from 'src/user/interfaces/user.interface';

export const filterOutUserData = (user: User): UserNoPassword => {
  delete user.password;
  delete user.refreshToken;

  return user;
};
