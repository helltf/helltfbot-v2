import { LevelCommand } from "@src/commands/cmd/level"
import { UidCommand } from "@src/commands/cmd/uid"
import { HelpCommmand } from '@src/commands/cmd/help'
import { StatsCommand } from '@src/commands/cmd/stats'
import { EvalCommand } from '@src/commands/cmd/eval'
import { RemoveCommand } from '@src/commands/cmd/remove'
import { ColorHistoryCommand } from '@src/commands/cmd/colorhistory'
import { SetLevelCommand } from '@src/commands/cmd/setlevel'
import { TimeoutsCommand } from '@src/commands/cmd/timeouts'
import { AllowCommand } from '@src/commands/cmd/allow'
import { EmoteCommand } from '@src/commands/cmd/emote'
import { EmotegameCommand } from '@src/commands/cmd/emotegame'
import { GithubCommand } from '@src/commands/cmd/github'
import { JoinCommand } from '@src/commands/cmd/join'
import { LeaveCommand } from '@src/commands/cmd/leave'
import { NotifyCommand } from '@src/commands/cmd/notify'
import { PingCommand } from '@src/commands/cmd/ping'
import { RemoveSuggestCommand } from '@src/commands/cmd/rmsuggestion'
import { SuggestCommand } from '@src/commands/cmd/suggest'
import { WebsiteCommand } from '@src/commands/cmd/website'
import { AddCommand } from '@src/commands/cmd/add'
import { RemovemeCommand } from '@src/commands/cmd/removeme'
import { YoinkCommand } from '@src/commands/cmd/yoink'
import { SetAliasCommand } from '@src/commands/cmd/setalias'
import { ModCountCommand } from '@src/commands/cmd/modcount'
import { DenyCommand } from '@src/commands/cmd/deny'
import { RandomColorCommand } from '@src/commands/cmd/randomcolor'
import { DisableCommand } from '@src/commands/cmd/disable'
import { AcceptCommand } from './cmd/accept'
import { BanCheckCommand } from './cmd/bancheck'
import { CoinflipCommand } from './cmd/coinflip'
import { BaseCommand } from './base'
import { client } from '@src/client/main-client'
import { getDeps } from 'deps'

const getInitializedCommands = async (): Promise<BaseCommand[]> => {
  const deps = await getDeps()
  return [
    new PingCommand(deps.db, client, deps.utils),
    new AcceptCommand(),
    new RemovemeCommand(),
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
    new UidCommand(),
    new EmoteCommand(),
    new HelpCommmand(),
    new StatsCommand(),
    new EvalCommand(),
    new ColorHistoryCommand(),
    new SetLevelCommand(),
    new TimeoutsCommand(),
    new AddCommand(),
    new RemoveCommand(),
    new YoinkCommand(),
    new SetAliasCommand(),
    new ModCountCommand(),
    new DenyCommand(),
    new RandomColorCommand(),
    new DisableCommand(),
    new BanCheckCommand(),
    new CoinflipCommand()
  ]
}

export default getInitializedCommands 
