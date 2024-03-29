import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('bans')
export class BanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar')
  user: string

  @Column('varchar')
  channel: string

  @Column('bigint')
  at: number
}
