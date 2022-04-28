import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Notification } from "./notification.js";
@Entity('user')
export class TwitchUser extends BaseEntity{
    @PrimaryColumn('int')
    id: number

    @Column('varchar')
    name: string

    @Column('varchar')
    color: string

    @Column('tinyint')
    permission: number

    @Column('bigint')
    registered_at: number

    @Column('varchar')
    display_name: string
    
    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[]
}