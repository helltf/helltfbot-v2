import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('command')
export class CommandEntity extends BaseEntity {
  @PrimaryColumn('varchar')
  name: string

  @Column('int', { default: 0 })
  counter: number

  @Column('int')
  permissions: number

  @Column('varchar')
  description: string

  @Column('varchar', { array: true })
  requiredParams?: string[]

  @Column('varchar', { array: true })
  optionalParams?: string[]

  @Column('int')
  cooldown: number

  @Column('boolean', { default: false })
  deleted: boolean

  @Column('varchar', { array: true, nullable: true })
  alias: string[]
}
