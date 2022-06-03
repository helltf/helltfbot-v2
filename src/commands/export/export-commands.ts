import { AllowCommand } from "../cmd/allow.js"
import { GithubCommand } from "../cmd/github.js"
import { JoinCommand } from "../cmd/join.js"
import { LeaveCommand } from "../cmd/leave.js"
import { NotifyCommand } from '../cmd/notify.js'
import { PingCommand } from '../cmd/ping.js'
import { RemoveSuggestCommand } from '../cmd/rmsuggestion.js'
import { SuggestCommand } from '../cmd/suggest.js'
import { WebsiteCommand } from '../cmd/website.js'
import { Command } from '../types.js'

const commands: Command[] = [
  new PingCommand(),
  new GithubCommand(),
  new WebsiteCommand(),
  new NotifyCommand(),
  new SuggestCommand(),
  new RemoveSuggestCommand(),
  new JoinCommand(),
  new LeaveCommand(),
  new AllowCommand()
]
export default commands
