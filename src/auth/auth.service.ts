import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { LoginDto } from './dto/login.dto';
import { verifyPassword } from 'src/utils/crypto.util';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: LoginDto): Promise<LoginResponseDto> {
    const user = await this.accountService.findByEmail(credentials.email);
    if (user && (await verifyPassword(credentials.password, user.password))) {
      const accessToken = await this.jwtGenerate(user.id, user.email , user.role);
      return {
        accessToken,
        account: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } else {
      throw new UnauthorizedException('invalid email or password');
    }
  }

  jwtGenerate(id: number, email: string , role: 'ADMIN' | 'EMPLOYEE') {
    const payload = { sub: id, email , role};
    const accessToken = this.jwtService.signAsync(payload);
    return accessToken;
  }
}
