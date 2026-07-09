import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrievanceModule } from './grievance/grievance.module';
import { Grievance } from './grievance/entities/grievance.entity';
import { AuthModule } from './auth/auth.module';
import { TrustEvent } from './auth/entities/trust-event.entity';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { MsmeModule } from './msme/msme.module';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';

const isTest = process.env.NODE_ENV === 'test';

const providers: any[] = [
  AppService,
  Reflector,
];

if (!isTest) {
  providers.push({
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (isTest) {
          return {
            type: 'sqljs',
            autoSave: false,
            entities: [Grievance, TrustEvent, Transaction, Account],
            synchronize: true,
            dropSchema: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5435),
          username: configService.get<string>('DB_USER', 'admin'),
          password: configService.get<string>('DB_PASSWORD', 'password'),
          database: configService.get<string>('DB_NAME', 'trustbank'),
          entities: [Grievance, TrustEvent, Transaction, Account],
          synchronize: true, // For dev only
        };
      },
    }),
    GrievanceModule,
    AuthModule,
    TransactionModule,
    MsmeModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers,
})
export class AppModule {}
