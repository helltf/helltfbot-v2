import commands from './export/export-commands.js'

const addNewCommands = async () => {
  for await (const command of commands) {
    await hb.db.commandRepo.save({
      ...command
    })
  }
}

export const updateCommandsInDb = async () => {
  if (!hb.isProd()) return
  await addNewCommands()
  await removeDeletedCommands()
}

async function removeDeletedCommands() {
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
