import { Repository } from "typeorm"
import { WordleWord } from "./entity/wordle.js"
import { AppDataSource } from "./export-orm.js"

const repositories = {
    wordleRepo: AppDataSource.getRepository(WordleWord)
}

export interface DbRepositories{
    wordleRepo: Repository<WordleWord>
}

export {repositories}