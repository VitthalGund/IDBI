import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: any;

  beforeEach(async () => {
    accountService = {
      registerDevice: jest.fn().mockResolvedValue({ deviceId: 'new-dev-1' }),
      listDevices: jest
        .fn()
        .mockResolvedValue([{ deviceId: 'dev-1', username: 'testuser' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: accountService }],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  describe('registerDevice', () => {
    it('registers a device with scoped username', async () => {
      const result = await controller.registerDevice(
        { user: { deviceId: 'dev-1', username: 'testuser' } },
        'My Phone',
        'secret-key',
      );
      expect(result.success).toBe(true);
      expect(result.deviceId).toBe('new-dev-1');
      expect(accountService.registerDevice).toHaveBeenCalledWith(
        'dev-1',
        'My Phone',
        'secret-key',
        'testuser',
      );
    });
  });

  describe('getDevices', () => {
    it('fetches devices scoped to username', async () => {
      const result = await controller.getDevices({
        user: { username: 'testuser' },
      });
      expect(result.length).toBe(1);
      expect(accountService.listDevices).toHaveBeenCalledWith('testuser');
    });
  });
});
