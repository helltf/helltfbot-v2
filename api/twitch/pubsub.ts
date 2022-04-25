import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'

interface Topic {
	name: string
	topic: string
	channel: string
	channelId: number
}

interface WebSocketConnections {
    connection: ReconnectingWebSocket,
    interval: NodeJS.Timer
}

interface PubSubMessage {
    type: string,
    nonce: string, 
    data: {
        topics: string[], 
        auth_token: string
    }
}

const size = 50

const connections: WebSocketConnections[] = []

const topics: Topic[] = [
	{
		name: 'video-playback-by-id.',
		topic: 'video-playback-by-id.109035947',
		channel: 'helltf',
		channelId: 109035947,
	},
]

const setPingInterval = (con: ReconnectingWebSocket): NodeJS.Timer => {
	return setInterval(() => {
		con.send(
			JSON.stringify({
				type: 'PING',
			})
		)
	}, 250 * 1000)
}

const connectPubSub = () => {
	const newConnections = chunkTopicsInto50(topics)

	for (let newConnection of newConnections) {
		const connection = new RWS.default('wss://pubsub-edge.twitch.tv', [], {
			WebSocket: WS.WebSocket,
		})

		let conInterval = setPingInterval(connection)

		connection.addEventListener('open', () => { 
            connections.push({
                connection: connection,
                interval: conInterval
            })
        })

        startPubSubConnection(connection)
	}
}

const startPubSubConnection = (con: ReconnectingWebSocket) => {
    con.addEventListener('message', (data) => {
        console.log(data)
    })
    const message: PubSubMessage = {
        type: 'LISTEN',
        nonce: '',
        data: {
            auth_token: process.env.TWITCH_OAUTH,
            topics: [topics[0].topic]
        }
    }
    con.send(JSON.stringify(message))
}

const chunkTopicsInto50 = (array: Topic[]): Topic[][] => {
	return array.reduce((acc, _, index) => {
		return index % size ? acc : [...acc, array.slice(index, index + size)]
	}, [])
}

export {connectPubSub}