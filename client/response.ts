export class BotResponse {
	success: boolean
	response: string
	channel: string

	constructor(response: string, channel: string, success: boolean = true) {
		this.success = success
		this.response = response
		this.channel = channel
	}
}
