import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('notification')
export class Notification extends BaseEntity{
    @PrimaryColumn('int')
    id: number
    
    @Column('varchar')
    streamer: string

    @Column('tinyint')
    live: boolean

    @Column('tinyint')
    offline: boolean

    @Column('tinyint')
    title: boolean

    @Column('tinyint')
    game: boolean
    
}