import { hb } from "../helltfbot.js";
import { Module } from "./export/module.js";


const initialize = () => {
    hb.watchclient.on('ban', (channel: string, username: string) => {
        channel = channel.replace('#', '')
        
        hb.db.banRepo.save({
            at: Date.now(),
            channel: channel, 
            user: username
        })
    })
    
}

const banModule: Module = {
    initialize: initialize
}

export { banModule }