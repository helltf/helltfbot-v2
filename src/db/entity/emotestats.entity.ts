import { TwitchUserEntity } from "@db/entities";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('emotegame_stats')
export class EmoteStatsEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @OneToOne(() => TwitchUserEntity, user => user.emotegameStats)
    @JoinColumn()
    user: TwitchUserEntity

    @Column('int', { default: 0 })
    incorrect_guesses: number

    @Column('int', { default: 0 })
    letter_guesses: number

    @Column('int', { default: 0 })
    emote_guesses: number
}