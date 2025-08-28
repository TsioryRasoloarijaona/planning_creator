import { All } from '@nestjs/common';
import { Allow } from 'class-validator';
import { Prisma } from 'generated/prisma'; 

export class UpdateOneLeaveDto {
  @Allow()
  id: number;

  @Allow()
  adminId?: number;

  @Allow()
  status: Prisma.EnumStatusFieldUpdateOperationsInput;
}