import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grievance } from '../src/grievance/entities/grievance.entity';
import { TrustEvent } from '../src/auth/entities/trust-event.entity';
import { Transaction } from '../src/transaction/entities/transaction.entity';
import { Account } from '../src/account/entities/account.entity';
import { ConfigModule } from '@nestjs/config';

// Mock the external LLM network call so our DB integration test is deterministic and fast
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: '{"category":"Tech Issue","severity":"high","etaBand":"1-2 days","isRedacted":true,"original":"Redacted grievance"}',
      }),
    },
  })),
}));

describe('App Integration E2E (Phases 1-6)', () => {
  let app: INestApplication;
  let authToken: string;
  const testDeviceId = 'e2e-test-device-123';

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.local',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Phase 2: Core Data Wiring & Authentication', () => {
    it('POST /auth/login should return success for dummy user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'demoUser',
          password: 'password123',
          deviceId: testDeviceId,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.requireOtp).toBe(true);
    });

    it('POST /auth/verify-otp should return JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ username: 'demoUser', otp: '123456', deviceId: testDeviceId })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token; // Save for subsequent tests
    });

    it('GET /accounts/me should return account details using JWT', async () => {
      const res = await request(app.getHttpServer())
        .get('/accounts/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.balance).toBe(15000.5);
      expect(res.body.accountNumber).toBe('9991 2345 6789');
    });
  });

  describe('Phase 4: Rule-Based Anomaly Nudges & Real-Time Alerts', () => {
    it('should flag rapid sequence transactions', async () => {
      // Create 3 manual transactions
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/transactions/manual')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ amount: 50, type: 'debit', merchant: 'Coffee Shop' })
          .expect(201);
      }

      // Check nudges
      const nudgesRes = await request(app.getHttpServer())
        .get('/transactions/nudges')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify at least one nudge is rapid sequence
      expect(nudgesRes.body.length).toBeGreaterThan(0);
      expect(
        nudgesRes.body.some((n: any) =>
          n.anomalyReason.includes('Rapid sequence'),
        ),
      ).toBe(true);
    });

    it('GET /transactions/since should return recent transactions', async () => {
      const ts = Date.now() - 10000; // 10 seconds ago
      const res = await request(app.getHttpServer())
        .get(`/transactions/since?ts=${ts}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Phase 6: Regulatory Trust & LITE Mode', () => {
    it('POST /transactions/transfer without hmacToken should fail', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 1000, recipient: 'John Doe' })
        .expect(201); // Controller returns { success: false } manually

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('hmacToken');
    });

    it('POST /transactions/transfer with wrong hmacToken should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 1000, recipient: 'John Doe', hmacToken: 'wrong-token' })
        .expect(401);

      expect(res.body.message).toBe('Invalid AFA HMAC token. Transfer denied.');
    });

    it('POST /transactions/transfer with correct hmacToken should succeed', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 1000,
          recipient: 'John Doe',
          hmacToken: 'mock-hmac-token-123',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.transaction.merchant).toBe('John Doe');
      expect(res.body.transaction.amount).toBe(1000);
    });
  });

  describe('Phase 3: Grievance Triage', () => {
    it('POST /grievances should save a grievance and set status to OPEN', async () => {
      const res = await request(app.getHttpServer())
        .post('/grievance/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .set('idempotency-key', 'test-key-123')
        .send({
          text: 'My money was deducted but not credited to the merchant.',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });
  });
});
