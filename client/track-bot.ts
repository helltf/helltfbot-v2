import { IdentityOptions } from '../config/config.js'
import { Client } from 'tmi.js'
import { hb } from '../helltfbot.js'
import { wait } from '../utilities/timeout.js'

const watchClient = createWatchClient()

function createWatchClient(){
    let watchClientOptions = new IdentityOptions("sajkdkjls" ,"justinfan284")
    return Client({identity: watchClientOptions})
}

async function watchJoinAllChannels(){
    if(process.env.NODE_ENV === 'dev'){
        watchClient.join(process.env.MAIN_USER)
        return
    }

    let channels = await hb.db.watchRepo.find()
    
    for await (let {channel} of channels){
        await watchClient.join(channel)
        await wait`1s`
    }

    hb.log(`Successfully joined ${channels.length} channels to watch`)
}

export { watchClient, watchJoinAllChannels }