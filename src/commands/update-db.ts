const addNewCommands = async () => {
  for await (const command of hb.commands.getAll()) {
    await hb.db.commandRepo.save({
      ...command
    })
  }
}


const removeDeletedCommands = async () => {
  const commandNames = await hb.db.commandRepo.find()

  for await (const { name } of commandNames) {
    if (!hb.commands.findCommand(name)) {
      await hb.db.commandRepo.update({
        name: name
      }, {
        deleted: true
      })
    }
  }
}

export const updateCommandsInDb = async () => {
  if (!hb.isProd()) return
  await addNewCommands()
  await removeDeletedCommands()
}
