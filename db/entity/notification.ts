import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TwitchUser } from './user.js'

@Entity('notification')
@Index(['streamer', 'user'], { unique: true })
export class Notification extends BaseEntity implements NotificationInfo {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar')
  streamer: string

  @Column('varchar')
  channel: string

  @Column('tinyint', { default: false })
  live: boolean

  @Column('tinyint', { default: false })
  offline: boolean

  @Column('tinyint', { default: false })
  title: boolean

  @Column('tinyint', { default: false })
  game: boolean

  @ManyToOne(() => TwitchUser, (user) => user.notifications)
  user: TwitchUser
}

export interface NotificationInfo {
  id?: number
  streamer?: string
  channel?: string
  live?: boolean
  offline?: boolean
  title?: boolean
  game?: boolean
  user?: TwitchUser
}
