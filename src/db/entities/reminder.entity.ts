import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TwitchUserEntity } from "./user.entity"

export enum ReminderStatus {
  PENDING = 'pending',
  FIRED = 'fired',
  REVOKED = 'revoked'
}

export enum ReminderType {
  SYSTEM = 'system',
  USER = 'user'
}

@Entity('reminders')
export class ReminderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => TwitchUserEntity, user => user.notifications, {
    nullable: true,
    eager: true
  })
  creator: TwitchUserEntity | null

  @ManyToOne(() => TwitchUserEntity, user => user.notifications, {
    eager: true
  })
  reciever: TwitchUserEntity

  @Column('varchar')
  message: string

  @Column('bigint')
  createdAt: number

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING
  })
  status: ReminderStatus

  @Column('bigint', { nullable: true })
  firedAt: number | null

  @Column('varchar', { nullable: true, default: null })
  firedChannel: string | null

  @Column('varchar', { nullable: true, default: null })
  createdChannel: string | null

  @Column('enum', { enum: ReminderType })
  type: ReminderType

  @Column('bigint', { nullable: true })
  scheduledAt?: number
}
