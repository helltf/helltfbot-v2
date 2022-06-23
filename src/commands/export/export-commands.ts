import { LevelCommand } from "@src/commands/cmd/level"
import { UidCommand } from "@src/commands/cmd/uid"
import { AllowCommand } from "../cmd/allow"
import { EmotegameCommand } from "../cmd/emotegame"
import { GithubCommand } from '../cmd/github'
import { JoinCommand } from '../cmd/join'
import { LeaveCommand } from '../cmd/leave'
import { NotifyCommand } from '../cmd/notify'
import { PingCommand } from '../cmd/ping'
import { RemoveSuggestCommand } from '../cmd/rmsuggestion'
import { SuggestCommand } from '../cmd/suggest'
import { WebsiteCommand } from '../cmd/website'
import { Command } from '../types'

const commands: Command[] = [
  new PingCommand(),
  new GithubCommand(),
  new WebsiteCommand(),
  new NotifyCommand(),
  new SuggestCommand(),
  new RemoveSuggestCommand(),
  new JoinCommand(),
  new LeaveCommand(),
  new AllowCommand(),
  new EmotegameCommand(),
  new LevelCommand(),
  new UidCommand()
]

export default commands
