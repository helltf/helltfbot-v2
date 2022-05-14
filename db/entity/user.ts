import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { PermissionLevel } from '../../utilities/twitch/types.js'
import { Notification } from './notification.js'
import { Suggestion } from './suggestion.js'

@Entity('user')
export class TwitchUser extends BaseEntity {
  @PrimaryColumn('int')
  id: number

  @Column('varchar')
  name: string

  @Column('varchar', { nullable: true })
  color?: string

  @Column('tinyint', { default: PermissionLevel.USER })
  permission: PermissionLevel

  @Column('bigint')
  registered_at: number

  @Column('varchar')
  display_name: string

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]

  @OneToMany(() => Suggestion, (suggestion) => suggestion.user)
  suggestions: Suggestion[]
}
