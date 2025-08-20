// database.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma'; // <-- ou 'generated/prisma' si output custom

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
