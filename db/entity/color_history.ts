import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TwitchUser } from './user.js'

@Entity('color_history')
export class ColorHistory extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar', { array: true })
  history: string[]

  @Column('bigint')
  change_timestamp: number

  @Column('bigint')
  register_timestamp: number

  @OneToOne(() => TwitchUser, (user) => user.colors) // specify inverse side as a second parameter
  user: TwitchUser
}
