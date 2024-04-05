import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './interfaces/user.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const id = uuidv4();
    const newUser = {
      id,
      ...dto,
      version: 1,
    };

    return this.prisma.user.create({
      data: newUser,
    });
  }

  async updateUser(dto: UpdatePasswordDto, id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: dto.newPassword,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
