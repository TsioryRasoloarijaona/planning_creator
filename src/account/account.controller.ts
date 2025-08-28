import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { createAccountRequest } from './dto/create-account-request.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { createAccountResDto } from './dto/create--account-res.dto';
import type { AutentificatedRequestDto } from 'src/auth/dto/request.dto';

@Controller('account')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body() createAccountDto: createAccountRequest,
  ): Promise<createAccountResDto> {
    return this.accountService.create(createAccountDto);
  }

  @Get('ping')
  @Roles('EMPLOYEE')
  ping(@Req() req: AutentificatedRequestDto) {
    return req.user;
  }

  @Get()
  @Roles('ADMIN')
  @Get()
  async getAll(@Query('page') page = '1') {
    const pageNumber = parseInt(page, 10) || 1;
    return this.accountService.findAll(pageNumber);
  }

  @Get('me')
  @Roles('EMPLOYEE', 'ADMIN')
  findOne(@Req() req: AutentificatedRequestDto) {
    return this.accountService.findOne(req.user.userId);
  }

  @Get('filter')
  @Roles('ADMIN')
  async getFilter(@Query('filter') filter: string) {
    return this.accountService.findFilter(filter);
  }
}
