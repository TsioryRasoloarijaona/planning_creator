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
import { CreateLeaveDto } from './dto/create-leave.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mail: MailService,
  ) {}

  async create(createLeaveDto: CreateLeaveDto) {
    try {
      const leave = await this.db.leave.create({
        data: {
          StartDate: createLeaveDto.StartDate,
          EndDate: createLeaveDto.EndDate,
          Reason: createLeaveDto.Reason,
          account: { connect: { id: createLeaveDto.accountId } },
        },
      });
      const acc = await this.db.account.findUnique({
        where: {
          id: leave.accountId,
        },
      });
      await this.mail.sendLeaveRequest({
        to: 'callinout299@gmail.com',
        name: acc?.name || '',
        startDate: createLeaveDto.StartDate.toISOString(),
        endDate: createLeaveDto.EndDate.toISOString(),
        appName: 'callinOut',
      });

      return leave;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        'Error creating leave : ' + error.message,
      );
    }
  }

  async findAll(
    page = 1,
    take = 10,
  ): Promise<{ data: FindAllLeaveDto[]; total: number }> {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(take) || 10);
    const skip = (currentPage - 1) * pageSize;

  
    const [total, pendingCount] = await Promise.all([
      this.db.leave.count(),
      this.db.leave.count({ where: { Status: 'PENDING' } }),
    ]);

  
    const select = {
      id: true,
      Status: true,
      Reason: true,
      StartDate: true,
      EndDate: true,
      createdAt: true,
      updatedAt: true,
      account: { select: { id: true, name: true, email: true } },
      admin: { select: { id: true, name: true, email: true } },
    } as const;

    // Calcul de la fenêtre à récupérer
    let pendingSkip = 0;
    let pendingTake = 0;
    let nonPendingSkip = 0;
    let nonPendingTake = 0;

    if (skip < pendingCount) {
      // La page commence dans la zone PENDING
      pendingSkip = skip;
      pendingTake = Math.min(pageSize, pendingCount - pendingSkip);
      nonPendingSkip = 0;
      nonPendingTake = pageSize - pendingTake;
    } else {
      // La page est entièrement dans les NON-PENDING
      pendingSkip = 0;
      pendingTake = 0;
      nonPendingSkip = skip - pendingCount;
      nonPendingTake = pageSize;
    }

    const [pendingRows, nonPendingRows] = await Promise.all([
      pendingTake > 0
        ? this.db.leave.findMany({
            where: { Status: 'PENDING' },
            orderBy: { StartDate: 'desc' }, // tri secondaire
            skip: pendingSkip,
            take: pendingTake,
            select,
          })
        : Promise.resolve([]),
      nonPendingTake > 0
        ? this.db.leave.findMany({
            where: { NOT: { Status: 'PENDING' } },
            orderBy: { StartDate: 'desc' },
            skip: nonPendingSkip,
            take: nonPendingTake,
            select,
          })
        : Promise.resolve([]),
    ]);

    const rows = [...pendingRows, ...nonPendingRows];

    const data: FindAllLeaveDto[] = rows.map((r) => ({
      id: r.id,
      status: r.Status,
      reason: r.Reason,
      startDate: r.StartDate.toISOString(),
      endDate: r.EndDate.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
      accountId: r.account.id,
      adminValidator: r.admin ? r.admin.id : null,
      account: r.account,
      admin: r.admin,
    }));

    return { data, total };
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
          admin: {
            select: {
              name: true,
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
