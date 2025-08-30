import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { LeaveModule } from './leave/leave.module';
import { PlanningModule } from './planning/planning.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DatabaseModule, AccountModule, AuthModule, LeaveModule, PlanningModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
