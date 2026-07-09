import { Controller, Get } from '@nestjs/common';
import { MsmeService } from './msme.service';

@Controller('msme')
export class MsmeController {
  constructor(private readonly msmeService: MsmeService) {}

  @Get('cashflow')
  async getCashflow() {
    return this.msmeService.getCashflowData();
  }
}
