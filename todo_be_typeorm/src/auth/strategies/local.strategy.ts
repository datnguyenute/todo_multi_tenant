import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    console.log('>> hello from LocalStrategy');
    super({
      usernameField: 'email', // 🔥
      passwordField: 'password',
    });
  }

  validate = async (email: string, password: string) => {
    console.log('> validate LocalStrategy');
    const user = await this.auth.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Email/Password is not valid.');
    }
    return user;
  };
}
