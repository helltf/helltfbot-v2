import { Repository } from 'typeorm'
import {
	WordleWord,
	ColorHistory,
	Channel,
	WatchChannel,
	TwitchUser,
	Ban,
	Timeout,
	CommandEntity,
	Notification,
	NotificationChannel,
} from './export-entities.js'
import { AppDataSource } from './export-orm.js'

export interface DbRepositories {
	wordleRepo: Repository<WordleWord>
	colorRepo: Repository<ColorHistory>
	channelRepo: Repository<Channel>
	watchRepo: Repository<WatchChannel>
	userRepo: Repository<TwitchUser>
	banRepo: Repository<Ban>
	timeoutRepo: Repository<Timeout>
	commandRepo: Repository<CommandEntity>
	notificationRepo: Repository<Notification>
	notificationChannelRepo: Repository<NotificationChannel>
}

export class DB implements DbRepositories {
	wordleRepo: Repository<WordleWord>
	colorRepo: Repository<ColorHistory>
	channelRepo: Repository<Channel>
	watchRepo: Repository<WatchChannel>
	userRepo: Repository<TwitchUser>
	banRepo: Repository<Ban>
	timeoutRepo: Repository<Timeout>
	commandRepo: Repository<CommandEntity>
	notificationRepo: Repository<Notification>
	notificationChannelRepo: Repository<NotificationChannel>

	constructor() {
		this.wordleRepo = AppDataSource.getRepository(WordleWord)
		this.colorRepo = AppDataSource.getRepository(ColorHistory)
		this.channelRepo = AppDataSource.getRepository(Channel)
		this.watchRepo = AppDataSource.getRepository(WatchChannel)
		this.userRepo = AppDataSource.getRepository(TwitchUser)
		this.banRepo = AppDataSource.getRepository(Ban)
		this.timeoutRepo = AppDataSource.getRepository(Timeout)
		this.commandRepo = AppDataSource.getRepository(CommandEntity)
		this.notificationRepo = AppDataSource.getRepository(Notification)
		this.notificationChannelRepo =
			AppDataSource.getRepository(NotificationChannel)
	}
	async initialize(): Promise<DB>{
		await AppDataSource.initialize()
		return this
	}
}
