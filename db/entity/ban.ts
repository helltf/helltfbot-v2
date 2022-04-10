import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('ban')
export class Ban extends BaseEntity{
    @Column('varchar')
    user: string

    @Column('varchar')
    channel: string

    @Column('bigint')
    at: number
}