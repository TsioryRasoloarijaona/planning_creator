import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PlanningController],
  providers: [PlanningService],
  imports : [DatabaseModule],
})
export class PlanningModule {}
