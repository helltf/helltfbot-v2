import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TwitchUserEntity } from './user.entity'

@Entity('color_history')
export class ColorHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar', { array: true })
  history: string[]

  @Column('bigint')
  change_timestamp: number

  @Column('bigint')
  register_timestamp: number

  @OneToOne(() => TwitchUserEntity, user => user.colors)
  @JoinColumn()
  user: TwitchUserEntity
}
