import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('error')
export class ErrorEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    default: null
  })
  message: string

  @Column('varchar', {
    default: null
  })
  stack_trace: string

  @Column('bigint')
  timestamp: number
}
