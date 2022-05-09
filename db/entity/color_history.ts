import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('color_history')
export class ColorHistory extends BaseEntity {
  @PrimaryColumn('int')
  twitch_id: number

  @Column('simple-array')
  history: string[]

  @Column('bigint')
  change_timestamp: number

  @Column('bigint')
  register_timestamp: number
}
