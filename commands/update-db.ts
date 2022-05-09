const addNewCommands = () => {
  for (const [, command] of hb.commands) {
    hb.db.commandRepo.save({
      ...command
    })
  }
}

const update = () => {
  if (process.env.NODE_ENV !== 'prod') return
  addNewCommands()
  removeDeletedCommands()
}

async function removeDeletedCommands() {
  const commandNames = (await hb.db.commandRepo.find()).map((c) => c.name)

  for (const name of commandNames) {
    if (!hb.commands.get(name)) {
      hb.db.commandRepo.delete({
        name: name
      })
    }
  }
}
export { update as updateCommandsInDb }
