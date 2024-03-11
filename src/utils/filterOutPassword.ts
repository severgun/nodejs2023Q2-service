import { UserNoPassword } from 'src/user/interfaces/user-no-password.interface';
import { User } from 'src/user/interfaces/user.interface';

export const filterOutPassword = (user: User): UserNoPassword => {
  const { password: _, ...filteredUser } = user;

  return filteredUser;
};
