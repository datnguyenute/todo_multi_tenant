import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
import { CreateUserSocialDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('> validateUser');
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    if (user) {
      const isValidPassword = await this.usersService.verifyPassword(user.password, password);

      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    console.log('> Login');
    const { id, email, name, type } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
      type,
    };

    const accessToken = this.createAccessToken(payload);

    const refreshToken = this.createRefreshToken(payload);

    await this.usersService.updateUserToken(refreshToken, id);

    // Set to cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRE')!),
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRE')!),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id,
        name,
        email,
        type,
      },
    };
  }

  async processNewRefreshToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // rotate
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { id, email, name, type } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          id,
          name,
          email,
          type,
        };
        const accessToken = this.createAccessToken(payload);

        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refreshToken, id);

        // Set to cookie
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        response.cookie('access_token', accessToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRE')!),
        });

        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRE')!),
        });

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: {
            id,
            name,
            email,
            type,
          },
        };
      } else {
        throw new BadRequestException(`Refresh token is not valid.`);
      }
    } catch {
      throw new BadRequestException(`Refresh token is not valid.`);
    }
  }

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user.id);
    response.clearCookie('refresh_token');
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

  // Social login
  loginSocial = async (loginSocial: CreateUserSocialDto, response: Response) => {
    const { type: typeSocial, email: emailSocial } = loginSocial;
    let user = await this.usersService.findByEmail(emailSocial);

    if (user) {
      const typeExisted = user.type;
      if (typeExisted != typeSocial) {
        throw new BadRequestException(`Email ${emailSocial} has exited. Please use another email.`);
      }
    } else {
      user = await this.usersService.createUserSocial(loginSocial);
    }

    const { email, name, type, id } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
      type,
    };

    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refreshToken, id);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRE')!),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id,
        name,
        email,
        type,
      },
    };
  };
}
