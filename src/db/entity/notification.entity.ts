import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TwitchUserEntity } from './user.entity'

@Entity('notification')
@Index(['streamer', 'user'], { unique: true })
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar')
  streamer: string

  @Column('varchar')
  channel: string

  @Column('boolean', {
    default: false
  })
  live: boolean

  @Column('boolean', {
    default: false
  })
  offline: boolean

  @Column('boolean', {
    default: false
  })
  title: boolean

  @Column('boolean', {
    default: false
  })
  game: boolean

  @ManyToOne(() => TwitchUserEntity, user => user.notifications)
  user: TwitchUserEntity
}
