import commands from './export/export-commands.js'

const addNewCommands = () => {
  for (const command of commands) {
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
    if (!hb.commands.findCommand(name)) {
      hb.db.commandRepo.update({
        name: name
      }, {
        deleted: true
      })
    }
  }
}
export { update as updateCommandsInDb }