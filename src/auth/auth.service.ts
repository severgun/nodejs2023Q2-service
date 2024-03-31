import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashData(data) {
    return await bcrypt.hash(data, 10);
  }

  async signup(dto: SignupDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.userService.createUser({
      login: dto.login,
      password: hashedPassword,
    });

    const payload = { userId: newUser.id, login: newUser.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: '', // TODO: Implement refresh token
    };
  }
}
