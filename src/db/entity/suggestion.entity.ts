import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TwitchUserEntity } from './user.entity'


export enum SuggestionStatus {
  DENIED = "denied",
  ACCEPTED = "accepted",
  PENDING = "pending"
}
@Entity('suggestion')
export class SuggestionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => TwitchUserEntity, user => user.notifications)
  user: TwitchUserEntity

  @Column('varchar')
  suggestion: string

  @Column('bigint')
  date: number

  @Column('varchar', { default: SuggestionStatus.PENDING })
  status: SuggestionStatus

}