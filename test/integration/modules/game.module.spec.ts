import { Emotegame } from "../../../src/games/emotegame.js"
import { GameModule } from "../../../src/modules/game.module.js"
import { setup } from "../../test-utils/setup.js"

describe('test game module', () => {
  let module: GameModule

  beforeEach(() => {
    module = new GameModule()
    setup()
  })
})
