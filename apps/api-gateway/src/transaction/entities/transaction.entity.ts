import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column()
  type: string; // 'credit' | 'debit'

  @Column()
  merchant: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: false })
  isAnomaly: boolean;

  @Column({ nullable: true })
  anomalyReason: string;

  @Column()
  deviceId: string; // To link with user for demo purposes
}
