import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('watchchannel')
export class WatchChannel extends BaseEntity{
    @PrimaryColumn('varchar')
    channel: string

    @Column('bigint')
    joined_date: number
}