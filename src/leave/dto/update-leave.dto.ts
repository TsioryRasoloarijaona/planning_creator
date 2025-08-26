import { Allow } from 'class-validator';
import { Prisma } from 'generated/prisma';

export class UpdateLeaveDto {
  @Allow()
  ids: Array<number>;
  @Allow()
  adminId?: number;
  @Allow()
  status: Prisma.EnumStatusFieldUpdateOperationsInput;

}
