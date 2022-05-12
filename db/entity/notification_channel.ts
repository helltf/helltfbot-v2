import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('notification_channel')
export class NotificationChannel
  extends BaseEntity
  implements NotificationChannelInfo
{
  @PrimaryColumn('int')
  id: number

  @Column('varchar')
  name: string

  @Column('tinyint', { default: false })
  status: boolean

  @Column('tinyint', { default: false })
  setting: boolean
}

export interface NotificationChannelInfo {
  id: number
  name: string
  status: boolean
  setting: boolean
}
