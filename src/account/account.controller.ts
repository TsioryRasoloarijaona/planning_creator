import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { createAccountRequest } from './dto/create-account-request.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { createAccountResDto } from './dto/create--account-res.dto';

@Controller('account')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(
    @Body() createAccountDto: createAccountRequest,
  ): Promise<createAccountResDto> {
    return this.accountService.create(createAccountDto);
  }

  @Get('ping')
  @Roles('EMPLOYEE')
  ping(@Req() req) {
    return req.user;
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.accountService.findAll();
  }

  @Get('me')
  @Roles('EMPLOYEE', 'ADMIN')
  findOne(@Req() req) {
    return this.accountService.findOne(req.user.userId);
  }
}
