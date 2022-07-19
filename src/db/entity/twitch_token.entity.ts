import { TwitchUserEntity } from "./user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('twitch_tokens')
export class TwitchTokenEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('varchar')
    token: string


    @OneToOne(() => TwitchUserEntity, user => user.access_token)
    @JoinColumn()
    user: TwitchUserEntity
}