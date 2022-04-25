const liveEndpoint = "https://api.twitch.tv/helix/search/channels?query="

const fetchLiveData = async(channel: string) => {
    let result = await fetch(liveEndpoint + channel, {
        method: 'get'
    })
}

interface TwitchInfo{
    live?: boolean
    channel: string
    title?: string
    game?: number
}

export {fetchLiveData}