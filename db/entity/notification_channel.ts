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

  @Column('tinyint')
  status: boolean

  @Column('tinyint')
  setting: boolean
}

export interface NotificationChannelInfo {
  id: number
  name: string
  status: boolean
  setting: boolean
}
