import { TwitchUserEntity } from '@db/entities'
import { Column, OneToOne } from 'typeorm'

export enum StatusEnum {
  NONE = 'none',
  AFK = 'afk',
  SLEEP = 'sleep'
}

export class StatusEntity {
  @Column('enum', { enum: StatusEnum })
  status: StatusEnum

  @Column('bigint')
  lastChanged: number

  @Column('varchar', { nullable: true })
  message: string | undefined

  @OneToOne(() => TwitchUserEntity, user => user.notifications, {
    eager: true
  })
  user: TwitchUserEntity
}
