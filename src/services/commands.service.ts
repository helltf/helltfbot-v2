import { BaseCommand } from "@src/commands/base";
import {LogType} from "@src/logger/logger-export";
import { Command } from "../commands/types";

export class CommandService {
  commands: {
    activate: string[]
    command: BaseCommand
  }[] = []

  constructor(commands: BaseCommand[]) {
    const usedNames = []

    for (const command of commands) {
      this.checkForError(usedNames, command)
      this.commands.push({
        activate: [command.name, ...command.alias],
        command: command
      })

      usedNames.push(...[command.name, ...command.alias])
    }
  }

  findCommand(input: string): Command {
    return this.commands.filter(v => v.activate.includes(input))[0]?.command
  }

  checkForError(usedNames: string[], command: Command) {
    if (usedNames.includes(command.name)) {
      throw new Error('Command name is already in usage')
    }

    for (const alias of command.alias) {
      if (usedNames.includes(alias))
        throw new Error('alias is already in usage')
    }
  }

  getAll(): Command[] {
    return this.commands.map(c => c.command)
  }

  async updateDb() {
    await this.addCommandsToDb()
    await this.updateDeletedCommands()
    hb.log(LogType.DEBUG, 'Successfully updated commands in Database')
  }

  async updateDeletedCommands() {
    const commandNames = await hb.db.command.find()

    for await (const { name } of commandNames) {
      if (!this.findCommand(name)) {
        await hb.db.command.update(
          {
            name: name
          },
          {
            deleted: true
          }
        )
      }
    }
  }

  async addCommandsToDb() {
    for await (const command of this.getAll()) {
      await hb.db.command.save({
        ...command,
        deleted: false
      })
    }
  }
}
