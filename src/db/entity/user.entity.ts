import { EmoteStatsEntity } from './emotestats.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { GlobalPermissionLevel } from '../../utilities/permission/types'
import { ColorHistoryEntity } from './color_history.entity'
import { NotificationEntity } from './notification.entity'
import { SuggestionEntity } from './suggestion.entity'
import { TwitchTokenEntity } from './twitch_token.entity'

@Entity('user')
export class TwitchUserEntity extends BaseEntity {
  @PrimaryColumn('int')
  id: number

  @Column('varchar')
  name: string

  @Column('varchar', {
    nullable: true
  })
  color?: string

  @Column('int', {
    default: GlobalPermissionLevel.USER
  })
  permission: GlobalPermissionLevel

  @Column('bigint')
  registered_at: number

  @Column('varchar')
  display_name: string

  @OneToMany(() => NotificationEntity, notification => notification.user)
  notifications: NotificationEntity[]

  @OneToMany(() => SuggestionEntity, suggestion => suggestion.user)
  suggestions: SuggestionEntity[]

  @OneToOne(() => ColorHistoryEntity, history => history.user)
  colors: ColorHistoryEntity

  @OneToOne(() => EmoteStatsEntity, stats => stats.user)
  emotegameStats: EmoteStatsEntity

  @OneToOne(() => TwitchTokenEntity, token => token.user)
  access_token: TwitchTokenEntity

}
