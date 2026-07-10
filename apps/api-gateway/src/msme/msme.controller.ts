import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MsmeService } from './msme.service';

@Controller('msme')
@UseGuards(JwtAuthGuard)
export class MsmeController {
  constructor(private readonly msmeService: MsmeService) {}

  @Get('cashflow')
  async getCashflow() {
    return this.msmeService.getCashflowData();
  }
}
