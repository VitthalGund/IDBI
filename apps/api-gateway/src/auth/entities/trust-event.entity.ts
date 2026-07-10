import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TrustEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @Column('int')
  scoreDelta: number;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
