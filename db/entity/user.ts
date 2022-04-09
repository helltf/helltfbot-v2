import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

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
}