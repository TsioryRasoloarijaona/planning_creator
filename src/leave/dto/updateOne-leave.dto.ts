import { Prisma } from 'generated/prisma'; 

export class UpdateOneLeaveDto {
  id: number;
  adminId: number;
  status: Prisma.EnumStatusFieldUpdateOperationsInput;
}