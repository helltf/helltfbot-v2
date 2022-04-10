import { hb } from "../helltfbot.js";

hb.watchclient.on('ban', (channel: string, username: string) => {
    channel = channel.replace('#', '')
    
    hb.db.banRepo.save({
        at: Date.now(),
        channel: channel, 
        user: username
    })
})