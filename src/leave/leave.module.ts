import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [DatabaseModule , MailModule],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
