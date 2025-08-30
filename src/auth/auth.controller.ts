import { Body, Controller, Get, Post, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() credentials: LoginDto,
  ) {
    const loginRs = await this.authService.validateUser(credentials);
    const token = loginRs.accessToken;
    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 3600000, 
      sameSite: 'none', 
      secure: true,
      path: '/', 
    });
    return loginRs;
  }

  @Get()
  async ping(){
    return "ping"
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
    return { message: 'Logout successful' };
  }

}
