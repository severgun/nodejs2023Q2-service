import { UserNoPassword } from 'src/user/interfaces/user-no-password.interface';
import { User } from 'src/user/interfaces/user.interface';

export const dateToNumber = (user: User | UserNoPassword) => {
  return {
    ...user,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
};
