import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { IsNull, Repository } from 'typeorm';
import { addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isValidPassword = await this.usersService.verifyPassword(password, user.password);

      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: User) {
    const { id, email, name } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
    };

    const accessToken = this.createAccessToken(payload);

    const refreshToken = this.createRefreshToken(payload);

    await this.usersService.updateUserToken(refreshToken, id);

    // TODO: Set to cookie

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async processNewRefreshToken(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // rotate
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { id, email, name } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          id,
          name,
          email,
        };
        const accessToken = this.createAccessToken(payload);

        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refreshToken, id);
        // TODO: Set to cookie

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: {
            id,
            name,
            email,
          },
        };
      } else {
        throw new BadRequestException(`Refresh token is not valid.`);
      }
    } catch {
      throw new BadRequestException(`Refresh token is not valid.`);
    }
  }

  logout = async (user: User) => {
    await this.usersService.updateUserToken('', user.id);
    // TODO: Clear token cookie
    return { success: true };
  };

  createRefreshToken = (payload: any) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRE'),
    });
  };

  createAccessToken = (payload: any) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRE'),
    });
  };
}
