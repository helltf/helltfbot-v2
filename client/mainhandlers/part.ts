import { hb } from "../../helltfbot.js"

hb.client.on('part', (channel: string, username: string, self: boolean) => {
	if(!self) return

	handlePart(channel, username)
})

function handlePart(channel: string, username: string){
    
}