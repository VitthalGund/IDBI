import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { DeviceRegistration } from './entities/device-registration.entity';

@Injectable()
export class AccountService implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(DeviceRegistration)
    private deviceRegistrationRepository: Repository<DeviceRegistration>,
  ) {}

  async onModuleInit() {
    // Seed dummy account data, we'll assign it to device ID dynamically upon first fetch or hardcoded 'admin' for demo
    const count = await this.accountRepository.count();
    if (count === 0) {
      await this.accountRepository.save({
        deviceId: 'default-device', // this will be updated or we can just fetch first account
        accountNumber: '9991 2345 6789',
        accountName: 'Retail Savings',
        balance: 15000.50,
        type: 'Savings',
      });
      await this.accountRepository.save({
        deviceId: 'msme-device',
        accountNumber: '8881 2345 6789',
        accountName: 'MSME Current',
        balance: 250000.00,
        type: 'Current',
      });
    }
  }

  async getAccount(deviceId: string, accountType: 'retail' | 'msme' = 'retail') {
    let account = await this.accountRepository.findOne({ where: { deviceId } });
    if (!account) {
      // For demo purposes, assign the requested account type to the newly registered deviceId
      const templateId = accountType === 'msme' ? 'msme-device' : 'default-device';
      account = await this.accountRepository.findOne({ where: { deviceId: templateId } });
      if (account) {
         // Create a new account for this device based on the template
         const newAccount = this.accountRepository.create({
           ...account,
           id: undefined,
           deviceId: deviceId,
         });
         return this.accountRepository.save(newAccount);
      }
    }
    return account;
  }

  async registerDevice(deviceId: string, deviceLabel: string, deviceSecret: string) {
    let device = await this.deviceRegistrationRepository.findOne({ where: { deviceId } });
    if (!device) {
      device = this.deviceRegistrationRepository.create({
        deviceId,
        deviceLabel,
        deviceSecret,
        consentTimestamp: new Date(),
      });
      await this.deviceRegistrationRepository.save(device);
    }
    return device;
  }

  async getDevice(deviceId: string) {
    return this.deviceRegistrationRepository.findOne({ where: { deviceId } });
  }

  async listDevices() {
    return this.deviceRegistrationRepository.find();
  }

  async revokeDevice(deviceId: string) {
    return this.deviceRegistrationRepository.delete({ deviceId });
  }
}
