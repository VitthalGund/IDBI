import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Grievance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  originalText: string;

  @Column({ nullable: true })
  intent: string;

  @Column({ nullable: true })
  priority: string;

  @Column({ type: 'int', nullable: true })
  severity: number;

  @Column({ nullable: true })
  etaBand: string;

  @Column('text', { nullable: true })
  suggestedResolution: string;

  @Column({ unique: true })
  idempotencyKey: string;

  @Column({ default: 'OPEN' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  internalDeadline: Date;
}
