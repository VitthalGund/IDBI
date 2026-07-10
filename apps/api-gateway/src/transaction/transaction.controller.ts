import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { AccountService } from '../account/account.service';
import * as crypto from 'crypto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
  ) {}

  @Get('since')
  async getSince(@Request() req: any, @Query('ts') ts: string) {
    const deviceId = req.user.deviceId;
    const sinceTs = parseInt(ts, 10);
    if (isNaN(sinceTs)) {
      return [];
    }
    return this.transactionService.getTransactionsSince(deviceId, sinceTs);
  }

  @Get('nudges')
  async getNudges(@Request() req: any) {
    const deviceId = req.user.deviceId;
    const nudges = await this.transactionService.getUserNudges(deviceId);
    return nudges;
  }

  @Post('manual')
  async createManualTransaction(
    @Request() req: any,
    @Body('amount') amount: number,
    @Body('type') type: string,
    @Body('merchant') merchant: string,
  ) {
    const deviceId = req.user.deviceId;
    if (!amount || !type || !merchant) {
      return {
        success: false,
        message: 'Amount, type, and merchant are required',
      };
    }
    const transaction = await this.transactionService.createTransaction({
      amount,
      type,
      merchant,
      deviceId,
    });
    return { success: true, transaction };
  }

  @Post('transfer')
  async transferFunds(
    @Request() req: any,
    @Body('amount') amount: number,
    @Body('recipient') recipient: string,
    @Body('timestamp') timestamp: string,
    @Body('hmacToken') hmacToken: string,
  ) {
    const deviceId = req.user.deviceId;

    if (!amount || !recipient || !hmacToken || !timestamp) {
      return {
        success: false,
        message: 'Amount, recipient, timestamp, and hmacToken are required',
      };
    }

    // AFA Compliance Check
    const device = await this.accountService.getDevice(deviceId);
    if (!device || !device.deviceSecret) {
      throw new UnauthorizedException('Device not registered for AFA');
    }

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > 60000) {
      // 60s window
      throw new UnauthorizedException('Transfer request expired');
    }

    const message = `${amount}:${recipient}:${timestamp}`;
    const expectedHmac = crypto
      .createHmac('sha256', device.deviceSecret)
      .update(message)
      .digest('hex');

    if (hmacToken !== expectedHmac) {
      throw new UnauthorizedException(
        'Invalid AFA HMAC token. Transfer denied.',
      );
    }

    const transaction = await this.transactionService.createTransaction({
      amount,
      type: 'debit',
      merchant: recipient,
      deviceId,
    });

    return { success: true, transaction };
  }
}
