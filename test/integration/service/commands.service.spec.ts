import { BaseCommand } from "@src/commands/base"
import { DB } from "@src/db/export-repositories"
import { CommandFlag } from "@src/commands/types"
import { DB } from "@src/db/export-repositories"
import { CommandService } from "@src/services/commands.service"
import { clearDb } from '../../test-utils/clear'
import { getExampleCommand } from '../../test-utils/example'

describe('test updating commands', () => {
  let db: DB
  beforeAll(async () => {
    db = new DB()
    await db.initialize()
  })

  beforeEach(async () => {
    await clearDb(db.dataSource)
  })

  afterAll(async () => {
    await db.dataSource.destroy()
  })

  describe('add commands to db', () => {
    it("commands are empty add new commands doesn't update database", async () => {
      const commands: BaseCommand[] = []
      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await db.command.find()

      expect(savedCommands).toHaveLength(0)
    })

    it('one command existing and one command will be save to db', async () => {
      const commands = [getExampleCommand({})]

      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await db.command.find()

      expect(savedCommands).toHaveLength(1)
    })

    it('two commands existing and two commands will be saved to db', async () => {
      const commands = [
        getExampleCommand({}),
        getExampleCommand({
          name: 'command1'
        })
      ]

      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await db.command.find()

      expect(savedCommands).toHaveLength(2)
    })

    it('command already exists in db and will set deleted to false', async () => {
      const exampleCommand = getExampleCommand({})

      await db.command.save({
        ...exampleCommand,
        deleted: true
      })

      const commandService = new CommandService([exampleCommand])

      await commandService.addCommandsToDb()

      const { deleted } = (await db.command.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBe(false)
    })

    it('command has disabled flag save disabled in database', async () => {
      const exampleCommand = getExampleCommand({
        flags: [CommandFlag.DISABLED]
      })

      const commandsService = new CommandService([exampleCommand])

      await commandsService.addCommandsToDb()

      const savedEntity = await hb.db.command.findOneBy({
        name: exampleCommand.name
      })

      expect(savedEntity?.disabled).toBe(true)
    })
  })

  describe('delete existing commands', () => {
    it("command is still existing and won't be deleted in db", async () => {
      const exampleCommand = getExampleCommand({})
      const commands = [exampleCommand]
      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const { deleted } = (await db.command.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBe(false)
    })
    it('command no longer exists deleted will be set to true', async () => {
      const exampleCommand = getExampleCommand({})

      await db.command.save(exampleCommand)

      const commandsService = new CommandService([])

      await commandsService.updateDeletedCommands()

      const { deleted } = (await db.command.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBe(true)
    })
  })
})
