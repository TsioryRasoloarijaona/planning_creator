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
import { PlanningService } from './planning.service';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Prisma } from 'generated/prisma';

@UseGuards(JwtAuthGuard , RolesGuard)
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() createPlanningDto: Prisma.PlanningWeekCreateInput) {
    return this.planningService.create(createPlanningDto);
  }

  @Get()
  findAll() {
    return this.planningService.findAll();
  }

  @Get(':week')
  findOne(@Param('week') week: string , @Req() req) {
    return this.planningService.findOne(req.user.userId , week);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanningDto: UpdatePlanningDto,
  ) {
    return this.planningService.update(+id, updatePlanningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(+id);
  }
}
