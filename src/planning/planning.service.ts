import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { Prisma , PlanningWeek } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { CreatePlanningDto } from './dto/create-planning.dto';

@Injectable()
export class PlanningService {
  constructor(private readonly db : DatabaseService){}
  async create(createPlanningDto: Prisma.PlanningWeekCreateInput) {
    try {
      const plan = await this.db.planningWeek.create({
        data : createPlanningDto
      })
      return plan
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error.message)
    }
  }

  findAll() {
    return `This action returns all planning`;
  }

  async findOne(id: number , week : string) {
    try {
      const result = await this.db.planningWeek.findFirst({
        where : {
          AND : {
            accountId : id ,
            isoWeek : week
          }
        },
        include : {
          slots : true
        }
      })
      return result
    } catch (error) {
      
    }
  }

  update(id: number, updatePlanningDto: UpdatePlanningDto) {
    return `This action updates a #${id} planning`;
  }

  remove(id: number) {
    return `This action removes a #${id} planning`;
  }
}
