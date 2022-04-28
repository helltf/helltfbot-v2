import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TwitchUser } from "./user.js";

@Entity('notification')
export class Notification extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    id: number

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

    @ManyToOne(()=> TwitchUser, user => user.notifications)
    user: TwitchUser
}