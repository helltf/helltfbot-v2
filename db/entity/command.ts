import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('command')
export class CommandEntity extends BaseEntity{
    @PrimaryColumn('varchar')
    name: string

    @Column('int', {default: 0})
    counter: number

    @Column('tinyint')
    permissions: number

    @Column('varchar')
    description: string

    @Column('simple-array')
    requiredParams?: string[]

    @Column('simple-array')
    optionalParams?: string[]

    @Column('int')
    cooldown: number 
}