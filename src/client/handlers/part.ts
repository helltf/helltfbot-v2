function handlePart(channel: string) {
  hb.db.channel.update(
    {
      channel: channel
    },
    {
      joined: false
    }
  )
}

export { handlePart }
