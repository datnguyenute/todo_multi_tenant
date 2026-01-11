import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    console.log('>> hello from LocalStrategy');
    super({
      usernameField: 'username', // 🔥 https://www.passportjs.org/api/passport-local/1.x/strategy/
      passwordField: 'password',
    });
  }

  validate = async (email: string, password: string) => {
    const user = await this.auth.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Username/Password is not valid.');
    }
    return user;
  };
}
