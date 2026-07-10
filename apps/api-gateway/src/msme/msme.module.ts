import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsmeService } from './msme.service';
import { MsmeController } from './msme.controller';
import { Invoice } from './entities/invoice.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Transaction])],
  providers: [MsmeService],
  controllers: [MsmeController],
})
export class MsmeModule {}
