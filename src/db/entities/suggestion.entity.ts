import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TwitchUserEntity } from './user.entity'

export enum SuggestionStatus {
  DENIED = 'denied',
  ACCEPTED = 'accepted',
  PENDING = 'pending'
}

@Entity('suggestions')
export class SuggestionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => TwitchUserEntity, user => user.notifications, {
    eager: true
  })
  user: TwitchUserEntity

  @Column('varchar')
  suggestion: string

  @Column('bigint')
  date: number

  @Column({
    type: 'enum',
    enum: SuggestionStatus,
    default: SuggestionStatus.PENDING
  })
  status: SuggestionStatus

  @Column('varchar', { default: null, nullable: true })
  reason: string

  @Column('varchar')
  channel: string
}
