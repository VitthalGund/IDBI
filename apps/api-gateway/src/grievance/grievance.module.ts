import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrievanceController } from './grievance.controller';
import { GrievanceService } from './grievance.service';
import { Grievance } from './entities/grievance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grievance])],
  controllers: [GrievanceController],
  providers: [GrievanceService],
})
export class GrievanceModule {}
