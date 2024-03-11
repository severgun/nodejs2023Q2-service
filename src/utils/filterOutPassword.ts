import { User, UserNoPassword } from 'src/user/user.service';

export const filterOutPassword = (user: User): UserNoPassword => {
  const { password: _, ...filteredUser } = user;

  return filteredUser;
};
