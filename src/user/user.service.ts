import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: Map<string, User> = new Map();

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  getById(id: string): User {
    return this.users.get(id);
  }

  createUser(dto: CreateUserDto): User {
    const id = uuidv4();
    const newUser: User = {
      id,
      ...dto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.set(id, newUser);

    return newUser;
  }

  updateUser(dto: UpdatePasswordDto, id: string): User {
    const user = this.getById(id);

    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    return user;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}
