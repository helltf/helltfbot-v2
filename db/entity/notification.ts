import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('notification')
export class Notification extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    id: number
    
    @Column('int')
    userId: number

    @Column('varchar')
    streamer: string

    @Column('varchar')
    channel: string

    @Column('tinyint')
    live: boolean

    @Column('tinyint')
    offline: boolean

    @Column('tinyint')
    title: boolean

    @Column('tinyint')
    game: boolean
    
}