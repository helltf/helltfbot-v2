import { Repository } from 'typeorm'
import { Channel } from './entity/channel.js'
import { ColorHistory } from './entity/color_history.js'
import { WatchChannel } from './entity/watchchannel.js'
import { WordleWord } from './entity/wordle.js'
import { AppDataSource } from './export-orm.js'

const repositories = {
	wordleRepo:  AppDataSource.getRepository(WordleWord),
	colorRepo:  AppDataSource.getRepository(ColorHistory),
	channelRepo:  AppDataSource.getRepository(Channel),
	watchRepo:  AppDataSource.getRepository(WatchChannel),
}

export interface DbRepositories {
	wordleRepo: Repository<WordleWord>
	colorRepo: Repository<ColorHistory>
	channelRepo: Repository<Channel>
    watchRepo: Repository<WatchChannel>
}

export { repositories }
