import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class LeaveService {
  constructor(private readonly db: DatabaseService) {}

  async create(createLeaveDto: Prisma.LeaveCreateInput) {
    try {
      return await this.db.leave.create({
        data: createLeaveDto,
      });
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        'Error creating leave : ' + error.message,
      );
    }
  }

  findAll() {
    return this.db.leave.findMany({
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} leave`;
  }

  findByAccountId(accountId: number) {
    try {
      return this.db.leave.findMany({
        where: {
          accountId: accountId,
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('there is no leave for this account');
    }
  }

  findByAdminId(adminId: number) {
    try {
      return this.db.leave.findMany({
        where: {
          adminValidator: adminId,
        },
      });
    } catch (error) {
      throw new NotFoundException('there is no leave for this admin');
    }
  }

  findByStatus(status: Prisma.EnumStatusFilter<'Leave'>) {
    try {
      return this.db.leave.findMany({
        where: {
          Status: status,
        },
      });
    } catch (error) {
      throw new NotFoundException('there is no leave with this status');
    }
  }

  update(id: number, updateLeaveDto: UpdateLeaveDto) {
    return `This action updates a #${id} leave`;
  }

  remove(id: number) {
    return `This action removes a #${id} leave`;
  }
}
