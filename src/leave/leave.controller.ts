import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Prisma } from 'generated/prisma';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() createLeaveDto: Prisma.LeaveCreateInput) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  @Get('account/:accountId')
  findByAccountId(@Param('accountId') accountId: number) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
