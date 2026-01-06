import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tokenHash: string;

  @Column()
  expiredAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;
}
