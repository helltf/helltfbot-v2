import { hb } from "../../helltfbot.js";
import { PubSubData, SettingMessage, StatusMessage, UpdateEventType } from "./types.js";

export class UpdateEventHandler{
    constructor(){}

    handleSettingUpdateEvent({ message }: PubSubData<SettingMessage>, streamer: string){
        console.log('Setting update:' + streamer)
        if(message.old_status !== message.status){
            this.sendMessage('helltf', `new title in ${streamer}: ${message.status}`)
        }
    
        if(message.old_game !== message.game){
            this.sendMessage('helltf', `new game in ${streamer}: ${message.game}`)
        }
    }
    handleStatusEvent(data: PubSubData<StatusMessage>, streamer: string){
        this.sendMessage('helltf', `${streamer} is live`)
    }
    sendMessage(channel: string, message: string){
        hb.sendMessage(channel, message)
    }
}