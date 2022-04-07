import { Repository } from "typeorm"
import { ColorHistory } from "./entity/color_history.js"
import { WordleWord } from "./entity/wordle.js"
import { AppDataSource } from "./export-orm.js"

const repositories = {
    wordleRepo: AppDataSource.getRepository(WordleWord),
    colorRepo: AppDataSource.getRepository(ColorHistory)
}

export interface DbRepositories{
    wordleRepo: Repository<WordleWord>
    colorRepo: Repository<ColorHistory>
}

export {repositories}