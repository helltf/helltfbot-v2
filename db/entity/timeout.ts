import { BaseEntity, Column, Entity } from "typeorm";

@Entity('timeout')
export class Timeout extends BaseEntity{
    @Column('varchar')
    user: string

    @Column('varchar')
    channel: string

    @Column('bigint')
    at: number

    @Column('bigint')
    duration: number
    
}