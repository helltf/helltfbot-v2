import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('channel')
export class ChannelEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar', { unique: true })
  channel: string

  @Column('boolean')
  allowed: boolean

  @Column('boolean')
  allowed_live: boolean

  @Column('boolean')
  joined: boolean

  @Column('int')
  times_connected: number

  @Column('bigint')
  connect_timestamp: number
}
