import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('commands')
export class CommandEntity extends BaseEntity {
  @PrimaryColumn('varchar')
  name: string

  @Column('int', {
    default: 0
  })
  counter: number

  @Column('int')
  permissions: number

  @Column('varchar')
  description: string

  @Column('text', { array: true })
  requiredParams?: string[]

  @Column('text', { array: true })
  optionalParams?: string[]

  @Column('int')
  cooldown: number

  @Column('boolean', {
    default: false
  })
  deleted: boolean

  @Column('varchar', {
    array: true,
    nullable: true
  })
  alias: string[]

  @Column('boolean', { default: false })
  disabled: boolean
}
