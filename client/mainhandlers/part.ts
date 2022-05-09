function handlePart(channel: string, username: string) {
  hb.db.channelRepo.update(
    {
      channel: channel
    },
    {
      joined: false
    }
  )
}

export { handlePart }
