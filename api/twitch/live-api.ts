const liveEndpoint = "https://api.twitch.tv/helix/search/channels?query="

const fetchLiveData = async(channel: string): Promise<TwitchInfo> => {
    return{
        channel: 'ds'
    }
}

interface TwitchInfo{
    live?: boolean
    channel: string
    title?: string
    game?: number
}