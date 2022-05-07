import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TwitchUser } from "./user.js";

@Entity('suggestion')
export class Suggestion extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => TwitchUser, (user) => user.notifications)
	user: TwitchUser

    @Column('varchar')
    suggestion: string

    @Column('bigint')
    date: number
    
}