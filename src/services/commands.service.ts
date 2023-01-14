import { BaseCommand } from "@src/commands/base";
import commands from "@src/commands/export-commands";
import {LogType} from "@src/logger/logger-export";
import { Command, CommandFlag } from "../commands/types";
import { Command } from '../commands/types'
import { logger } from 'src/logger/logger-export'
import { DB } from '@src/db/export-repositories'

export class CommandService {
  commands: {
    activate: string[]
    command: BaseCommand
  }[] = []

  db: DB

  constructor(commands: BaseCommand[], db: DB) {
    this.db = db
    const usedNames = []

    for (const command of commands) {
      this.checkForError(usedNames, command)
      this.commands.push({
        activate: [command.name, ...command.alias],
        command: command
      })

      usedNames.push(...[command.name, ...command.alias])
      this.updateDb()
    }
  }

  findCommand(input: string): BaseCommand {
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
    logger.log(LogType.DEBUG, 'Successfully updated commands in Database')
  }

  async updateDeletedCommands() {
    const commandNames = await this.db.command.find()

    for await (const { name } of commandNames) {
      if (!this.findCommand(name)) {
        await this.db.command.update(
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
      await this.db.command.save({
        ...command,
        deleted: false,
        disabled: command.flags.includes(CommandFlag.DISABLED)
      })
    }
  }
}
