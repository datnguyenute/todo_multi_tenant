import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserSocialDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public, User } from 'src/decorator/customize';
import type { Response, Request } from 'express';
import type { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('login-social')
  async loginSocial(@Body() createUserSocialDto: CreateUserSocialDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.loginSocial(createUserSocialDto, response);
  }

  @Get('account')
  getAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Get('refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewRefreshToken(refreshToken, response);
  }

  @Post('logout')
  async handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return await this.authService.logout(response, user);
  }
}
