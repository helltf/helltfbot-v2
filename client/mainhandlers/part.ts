import { hb } from '../../helltfbot.js'

hb.client.on('part', (channel: string, username: string, self: boolean) => {
	if (!self) return
	channel = channel.replace('#', '')
	
	handlePart(channel, username)
})

function handlePart(channel: string, username: string) {
	hb.db.channelRepo.update(
		{
			channel: channel,
		},
		{
			joined: false,
		}
	)
}
