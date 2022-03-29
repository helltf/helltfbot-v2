import * as tmi from 'tmi.js'

class TwitchBot {
    client: tmi.Client
    watchclient: tmi.Client
    commands: string[]
    constructor(client: tmi.Client, watchclient: tmi.Client){
        this.client = client
        this.watchclient = watchclient

        this.client.connect()
        this.watchclient.connect()

    }
}

export {TwitchBot}