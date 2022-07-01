import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('notification_channel')
export class NotificationChannelEntity extends BaseEntity {
  @PrimaryColumn('int')
  id: number

  @Column('varchar')
  name: string

  @Column('boolean', {
    default: false
  })
  status: boolean

  @Column('boolean', {
    default: false
  })
  setting: boolean
}