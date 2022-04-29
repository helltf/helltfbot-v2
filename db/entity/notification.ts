import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { TwitchUser } from './user.js'

@Entity('notification')
export class Notification extends BaseEntity implements NotificationInfo {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column('varchar')
	streamer: string

	@Column('varchar')
	channel: string

	@Column('tinyint')
	live: boolean

	@Column('tinyint')
	offline: boolean

	@Column('tinyint')
	title: boolean

	@Column('tinyint')
	game: boolean

	@ManyToOne(() => TwitchUser, (user) => user.notifications)
	user: TwitchUser
}

export interface NotificationInfo {
	id?: number
	streamer?: string
	channel?: string
	live?: boolean
	offline?: boolean
	title?: boolean
	game?: boolean
	user?: TwitchUser
}
