import { DataSource, Repository } from 'typeorm'
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
	Suggestion,
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
	suggestionRepo: Repository<Suggestion>
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
	suggestionRepo: Repository<Suggestion>
	dataSource: DataSource

	constructor(dataSource: DataSource = AppDataSource) {
		this.wordleRepo = dataSource.getRepository(WordleWord)
		this.colorRepo = dataSource.getRepository(ColorHistory)
		this.channelRepo = dataSource.getRepository(Channel)
		this.watchRepo = dataSource.getRepository(WatchChannel)
		this.userRepo = dataSource.getRepository(TwitchUser)
		this.banRepo = dataSource.getRepository(Ban)
		this.timeoutRepo = dataSource.getRepository(Timeout)
		this.commandRepo = dataSource.getRepository(CommandEntity)
		this.notificationRepo = dataSource.getRepository(Notification)
		this.suggestionRepo = dataSource.getRepository(Suggestion)
		this.notificationChannelRepo =
			dataSource.getRepository(NotificationChannel)

		this.dataSource = dataSource
	}
	async initialize(): Promise<DB>{
		await this.dataSource.initialize()
		return this
	}
}
