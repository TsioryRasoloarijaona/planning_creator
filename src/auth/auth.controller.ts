import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

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
      maxAge : 3600000
    });
    return loginRs;
  }

  @Get('test')
  async test() {
    return 'test';
  }
}
