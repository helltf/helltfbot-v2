import { Column } from 'typeorm'

enum StatusEnum {
  NONE = 'none',
  AFK = 'afk',
  SLEEP = 'sleep'
}

export class StatusEntity {
  @Column('enum', { enum: StatusEnum })
  status: StatusEnum

  @Column('bigint')
  lastChanged: number

  @Column('varchar')
  message: string
}
