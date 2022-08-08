import { TwitchUserEntity } from "./user.entity";
import { AfterLoad, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CryptoUtility } from '../../utilities/crypto'

@Entity('twitch_tokens')
export class TwitchTokenEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('bytea')
  token: Buffer

  access_token: string

  @Column('bytea')
  nonce: Buffer

  @Column('varchar')
  refresh_token: string

  @OneToOne(() => TwitchUserEntity, user => user.access_token)
  @JoinColumn()
  user: TwitchUserEntity

  @AfterLoad()
  setToken() {
    this.access_token = new CryptoUtility().openBox(this.token, this.nonce)
  }
}