import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

import { isoWeeksOfMonth } from 'src/utils/weeks-of-month.util';

@Injectable()
export class PlanningService {
  constructor(private readonly db: DatabaseService) {}
  async create(createPlanningDto: Prisma.PlanningWeekCreateInput) {
    try {
      const exist = await this.db.planningWeek.findFirst({
        where: {
          AND: {
            accountId: createPlanningDto.account.connect?.id,
            isoWeek: createPlanningDto.isoWeek,
          },
        },
      });
      if (exist)
        throw new ConflictException('this agent already have a planning');
      const plan = await this.db.planningWeek.create({
        data: createPlanningDto,
      });
      return plan;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByMonth(id: number, month: string) {
    const weeks = isoWeeksOfMonth(month);
    try {
      const result = await this.db.planningWeek.findMany({
        where: {
          accountId: id,
          OR: weeks.map((w) => ({
            isoWeek: { equals: w, mode: 'insensitive' as const },
          })),
        },
        include: {
          slots: true,
        },
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all planning`;
  }

  async findOne(id: number, week: string) {
    try {
      const result = await this.db.planningWeek.findFirst({
        where: {
          AND: {
            accountId: id,
            isoWeek: week,
          },
        },
        include: {
          slots: true,
        },
      });
      return result;
    } catch (error) {}
  }

  update(id: number, updatePlanningDto: UpdatePlanningDto) {
    return `This action updates a #${id} planning`;
  }

  remove(id: number) {
    return `This action removes a #${id} planning`;
  }
}
