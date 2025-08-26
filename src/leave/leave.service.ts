import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'generated/prisma';
import { UpdateOneLeaveDto } from './dto/updateOne-leave.dto';
import { FindAllLeaveDto } from './dto/find-all-leave.dto';

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

  async findAll(): Promise<FindAllLeaveDto[]> {
    const rows = await this.db.leave.findMany({
      select: {
        id: true,
        Status: true,
        Reason: true,
        StartDate: true,
        EndDate: true,
        createdAt: true,
        updatedAt: true,
        account: { select: { id: true, name: true, email: true } },
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => ({
      id: r.id,
      status: r.Status,
      reason: r.Reason,
      startDate: r.StartDate.toISOString(),
      endDate: r.EndDate.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt?.toISOString() ? r.updatedAt.toISOString() : null,
      accountId: r.account.id,
      adminValidator: r.admin ? r.admin.id : null,
      account: r.account,
      admin: r.admin,
    }));
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

  update(updateLeaveDto: UpdateLeaveDto) {
    const { ids, adminId, status } = updateLeaveDto;
    if (!ids.length)
      throw new InternalServerErrorException('ids array is empty');
    try {
      return this.db.leave.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          Status: status,
          adminValidator: adminId,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        'Error updating leave : ' + error.message,
      );
    }
  }

  updateOne(updateOne: UpdateOneLeaveDto) {
    const { id, adminId, status } = updateOne;
    try {
      return this.db.leave.update({
        where: {
          id: id,
        },
        data: {
          Status: status,
          adminValidator: adminId,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        'Error updating leave : ' + error.message,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} leave`;
  }
}
