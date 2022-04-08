import { Repository } from "typeorm"
import { Channel } from "./entity/channel.js"
import { ColorHistory } from "./entity/color_history.js"
import { WordleWord } from "./entity/wordle.js"
import { AppDataSource } from "./export-orm.js"

const repositories = {
    wordleRepo: AppDataSource.getRepository(WordleWord),
    colorRepo: AppDataSource.getRepository(ColorHistory),
    channelRepo: AppDataSource.getRepository(Channel)
}

export interface DbRepositories{
    wordleRepo: Repository<WordleWord>
    colorRepo: Repository<ColorHistory>
    channelRepo: Repository<Channel>
}

export {repositories}