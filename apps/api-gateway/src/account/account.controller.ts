import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  async getMyAccount(@Request() req: any) {
    const deviceId = req.user.deviceId;
    return this.accountService.getAccount(deviceId);
  }

  @Post('devices')
  async registerDevice(
    @Request() req: any,
    @Body('deviceLabel') deviceLabel: string,
    @Body('deviceSecret') deviceSecret: string,
  ) {
    const deviceId = req.user.deviceId || req.user.sub; // Handle fallback if auth guard sets sub differently
    const username = req.user.username;

    if (!deviceLabel || !deviceSecret) {
      throw new BadRequestException(
        'deviceLabel and deviceSecret are required',
      );
    }
    const device = await this.accountService.registerDevice(
      deviceId,
      deviceLabel,
      deviceSecret,
      username,
    );
    return { success: true, deviceId: device.deviceId };
  }

  @Get('devices')
  async getDevices(@Request() req: any) {
    const username = req.user.username;
    const devices = await this.accountService.listDevices(username);
    return devices;
  }

  @Delete('devices/:deviceId')
  async revokeDevice(@Param('deviceId') deviceId: string) {
    await this.accountService.revokeDevice(deviceId);
    return { success: true, message: 'Device revoked successfully' };
  }
}
