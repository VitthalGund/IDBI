import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TrustEvent } from './entities/trust-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrustEvent])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
