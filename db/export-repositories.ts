import { Repository } from 'typeorm'
import { WordleWord, ColorHistory, Channel, WatchChannel, TwitchUser, Ban, Timeout, CommandEntity, Notification, NotificationChannel } from './export-entities.js'
import { AppDataSource } from './export-orm.js'


const repositories = {
	wordleRepo:  AppDataSource.getRepository(WordleWord),
	colorRepo:  AppDataSource.getRepository(ColorHistory),
	channelRepo:  AppDataSource.getRepository(Channel),
	watchRepo:  AppDataSource.getRepository(WatchChannel),
    userRepo: AppDataSource.getRepository(TwitchUser),
	banRepo: AppDataSource.getRepository(Ban),
	timeoutRepo: AppDataSource.getRepository(Timeout),
	commandRepo: AppDataSource.getRepository(CommandEntity),
	notificationRepo: AppDataSource.getRepository(Notification),
	notificationChannelRepo: AppDataSource.getRepository(NotificationChannel)
}

export interface DbRepositories {
	wordleRepo: Repository<WordleWord>
	colorRepo: Repository<ColorHistory>
	channelRepo: Repository<Channel>
    watchRepo: Repository<WatchChannel>
    userRepo: Repository<TwitchUser>
	banRepo: Repository<Ban>,
	timeoutRepo: Repository<Timeout>
	commandRepo: Repository<CommandEntity>
	notificationRepo: Repository<Notification>
	notificationChannelRepo: Repository<NotificationChannel>
}

export { repositories }
