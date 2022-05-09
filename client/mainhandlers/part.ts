function handlePart(channel: string) {
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
