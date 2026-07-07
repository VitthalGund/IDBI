import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrievanceModule } from './grievance/grievance.module';
import { Grievance } from './grievance/entities/grievance.entity';
import { AuthModule } from './auth/auth.module';
import { TrustEvent } from './auth/entities/trust-event.entity';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { MsmeModule } from './msme/msme.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'password',
      database: 'trustbank',
      entities: [Grievance, TrustEvent, Transaction],
      synchronize: true, // For dev only
    }),
    GrievanceModule,
    AuthModule,
    TransactionModule,
    MsmeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
