import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ReminderStatus } from "./reminder.entity"
import { TwitchUserEntity } from "./user.entity"

@Entity('system_reminders')
export class SystemReminderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

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
}
