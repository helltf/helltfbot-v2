import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('timeout')
export class TimeoutEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar')
  user: string

  @Column('varchar')
  channel: string

  @Column('bigint')
  at: number

  @Column('bigint')
  duration: number
}
