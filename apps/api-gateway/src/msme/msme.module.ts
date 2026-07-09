import { Module } from '@nestjs/common';
import { MsmeService } from './msme.service';
import { MsmeController } from './msme.controller';

@Module({
  providers: [MsmeService],
  controllers: [MsmeController],
})
export class MsmeModule {}
