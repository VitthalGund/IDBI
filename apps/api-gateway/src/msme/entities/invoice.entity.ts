import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  status: string; // 'PENDING', 'PAID', 'OVERDUE'

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
