import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column()
  type: string;
}
