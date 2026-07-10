import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DeviceRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  deviceLabel: string;

  @Column()
  deviceSecret: string;

  @Column({ nullable: true })
  consentTimestamp: Date;

  @CreateDateColumn()
  registeredAt: Date;
}
