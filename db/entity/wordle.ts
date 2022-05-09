import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('wordle_words')
export class WordleWord extends BaseEntity {
  @PrimaryColumn('varchar')
  word: string

  @Column('boolean')
  is_answer: boolean
}
