import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('wordle_words')
export class WordleWordEntity extends BaseEntity {
  @PrimaryColumn('varchar')
  word: string

  @Column('boolean')
  is_answer: boolean
}
