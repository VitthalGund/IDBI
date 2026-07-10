import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MsmeService } from './msme.service';

@Controller('msme')
@UseGuards(JwtAuthGuard)
export class MsmeController {
  constructor(private readonly msmeService: MsmeService) {}

  @Get('cashflow')
  async getCashflow(@Request() req: any) {
    const deviceId = req.user.deviceId;
    return this.msmeService.getCashflowData(deviceId);
  }
}
