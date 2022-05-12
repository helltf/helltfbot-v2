import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('channel')
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar', { unique: true })
  channel: string

  @Column('tinyint')
  allowed: boolean

  @Column('tinyint')
  allowed_live: boolean

  @Column('tinyint')
  joined: boolean

  @Column('int')
  times_connected: number

  @Column('bigint')
  connect_timestamp: number
}
