import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TwitchUserEntity } from "./user.entity"

export enum ReminderStatus {
  CREATED = 'created',
  FIRED = 'fired',
  REVOKED = 'revoked'
}

@Entity('reminders')
export class ReminderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => TwitchUserEntity, user => user.notifications, {
    eager: true
  })
  creator: TwitchUserEntity

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
    default: ReminderStatus.CREATED
  })
  status: ReminderStatus

  @Column('bigint', { nullable: true })
  firedAt: number | null

  @Column('varchar', { nullable: true })
  firedChannel: string | null

  @Column('varchar')
  createdChannel: string
}
