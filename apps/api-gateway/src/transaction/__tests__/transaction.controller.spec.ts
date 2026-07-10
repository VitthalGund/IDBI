import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import { AccountService } from '../../account/account.service';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: any;
  let accountService: any;

  beforeEach(async () => {
    transactionService = {
      createTransaction: jest.fn().mockResolvedValue({ id: 't-123' }),
    };
    accountService = {
      getDevice: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: transactionService },
        { provide: AccountService, useValue: accountService },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  describe('transferFunds', () => {
    it('throws UnauthorizedException if device is not registered', async () => {
      accountService.getDevice.mockResolvedValue(null);
      await expect(
        controller.transferFunds(
          { user: { deviceId: 'dev-1' } },
          100,
          'Bob',
          Date.now().toString(),
          'dummyhmac',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if timestamp is expired', async () => {
      accountService.getDevice.mockResolvedValue({ deviceSecret: 'secret' });
      const oldTimestamp = (Date.now() - 70000).toString();
      await expect(
        controller.transferFunds(
          { user: { deviceId: 'dev-1' } },
          100,
          'Bob',
          oldTimestamp,
          'dummyhmac',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if HMAC is invalid', async () => {
      accountService.getDevice.mockResolvedValue({ deviceSecret: 'secret' });
      const timestamp = Date.now().toString();
      await expect(
        controller.transferFunds(
          { user: { deviceId: 'dev-1' } },
          100,
          'Bob',
          timestamp,
          'invalidhmac',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('creates transaction if HMAC is valid', async () => {
      accountService.getDevice.mockResolvedValue({ deviceSecret: 'secret' });
      const timestamp = Date.now().toString();
      const amount = 100;
      const recipient = 'Bob';

      const message = `${amount}:${recipient}:${timestamp}`;
      const validHmac = crypto
        .createHmac('sha256', 'secret')
        .update(message)
        .digest('hex');

      const result: any = await controller.transferFunds(
        { user: { deviceId: 'dev-1' } },
        amount,
        recipient,
        timestamp,
        validHmac,
      );

      expect(result.success).toBe(true);
      expect(result.transaction.id).toBe('t-123');
      expect(transactionService.createTransaction).toHaveBeenCalledWith({
        amount,
        type: 'debit',
        merchant: recipient,
        deviceId: 'dev-1',
      });
    });
  });
});
