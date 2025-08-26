import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Prisma } from 'generated/prisma';
import { UpdateOneLeaveDto } from './dto/updateOne-leave.dto';
import { FindAllLeaveDto } from './dto/find-all-leave.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() createLeaveDto: Prisma.LeaveCreateInput) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  findAll(): Promise<FindAllLeaveDto[]> {
    return this.leaveService.findAll();
  }

  @Get('account')
  @Roles('EMPLOYEE', 'ADMIN')
  findByAccountId(@Req() req) {
    const accountId = req.user.userId;
    return this.leaveService.findByAccountId(accountId);
  }

  @Get('admin/:adminId')
  findByAdminId(@Param('adminId') adminId: number) {
    return this.leaveService.findByAdminId(adminId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: Prisma.EnumStatusFilter<'Leave'>) {
    return this.leaveService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch('')
  @Roles('ADMIN')
  update(@Req() req ,@Body() updateLeaveDto: UpdateLeaveDto) {
    updateLeaveDto.adminId = req.user.userId;
    return this.leaveService.update(updateLeaveDto);
  }

  @Patch('one')
  updateOne(@Body() updateOneLeaveDto: UpdateOneLeaveDto) {
    return this.leaveService.updateOne(updateOneLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
