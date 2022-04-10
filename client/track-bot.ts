import { IdentityOptions } from '../config/config.js'
import { Client } from 'tmi.js'
import { hb } from '../helltfbot.js'
import { wait } from '../utilities/timeout.js'

const watchClient = createWatchClient()

function createWatchClient(){
    let watchClientOptions = new IdentityOptions("sajkdkjls" ,"justinfan284")
    return Client({identity: watchClientOptions})
}


export { watchClient }