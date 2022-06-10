import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TwitchUserEntity } from './user.entity'

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
}
