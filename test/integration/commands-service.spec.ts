import { CommandService } from "../../src/service/commands.service.js"
import { Command } from "../../src/commands/export/types.js"
import { clearDb } from "../test-utils/clear.js"
import { disconnectDatabase } from '../test-utils/disconnect.js'
import { getExampleCommand } from '../test-utils/example.js'
import { setupDatabase } from '../test-utils/setup-db.js'

describe('test updating commands', () => {
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('add commands to db', () => {
    it("commands are empty add new commands doesn't update database", async () => {
      const commands: Command[] = []
      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await hb.db.commandRepo.find()

      expect(savedCommands).toHaveSize(0)
    })

    it('one command existing and one command will be save to db', async () => {
      const commands = [getExampleCommand({})]

      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await hb.db.commandRepo.find()

      expect(savedCommands).toHaveSize(1)
    })

    it('two commands existing and two commands will be saved to db', async () => {
      const commands = [
        getExampleCommand({}),
        getExampleCommand({ name: 'command1' })
      ]

      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const savedCommands = await hb.db.commandRepo.find()

      expect(savedCommands).toHaveSize(2)
    })

    it('command already exists in db and will set deleted to false', async () => {
      const exampleCommand = getExampleCommand({})

      await hb.db.commandRepo.save({
        ...exampleCommand,
        deleted: true
      })

      const commandService = new CommandService([exampleCommand])

      await commandService.addCommandsToDb()

      const { deleted } = (await hb.db.commandRepo.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBeFalse()
    })
  })

  describe('delete existing commands', () => {
    it("command is still existing and won't be deleted in db", async () => {
      const exampleCommand = getExampleCommand({})
      const commands = [exampleCommand]
      const commandsService = new CommandService(commands)

      await commandsService.addCommandsToDb()

      const { deleted } = (await hb.db.commandRepo.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBeFalse()
    })
    it('command no longer exists deleted will be set to true', async () => {
      const exampleCommand = getExampleCommand({})

      await hb.db.commandRepo.save(exampleCommand)

      const commandsService = new CommandService([])

      await commandsService.updateDeletedCommands()

      const { deleted } = (await hb.db.commandRepo.findOneBy({
        name: exampleCommand.name
      }))!

      expect(deleted).toBeTrue()
    })
  })
})