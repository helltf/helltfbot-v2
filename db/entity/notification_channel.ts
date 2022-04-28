import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('notification_channel')
export class NotificationChannel extends BaseEntity{
    @PrimaryColumn('int')
    id: number

    @Column('varchar')
    name: string
}