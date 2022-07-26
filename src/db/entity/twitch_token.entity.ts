import { TwitchUserEntity } from "./user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('twitch_tokens')
export class TwitchTokenEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('bytea')
    token: Buffer

    @Column('bytea')
    nonce: Buffer

    @OneToOne(() => TwitchUserEntity, user => user.access_token)
    @JoinColumn()
    user: TwitchUserEntity
}