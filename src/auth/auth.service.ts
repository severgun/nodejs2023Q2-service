import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private logger: LoggingService,
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.userService.createUser({
      login: dto.login,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async login(dto: SignupDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException();
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshToken(dto: RefreshTokenDto): Promise<boolean> {
    return false;
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const payload = { userId, login };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_TTL,
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TTL,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(userId: string, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }
}
