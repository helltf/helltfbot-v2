import { BaseCommand } from "./base"
import { AcceptCommand } from "./cmd/accept"
import { AddCommand } from "./cmd/add"
import { AllowCommand } from "./cmd/allow"
import { BanCheckCommand } from "./cmd/bancheck"
import { CoinflipCommand } from "./cmd/coinflip"
import { ColorHistoryCommand } from "./cmd/colorhistory"
import { DenyCommand } from "./cmd/deny"
import { DisableCommand } from "./cmd/disable"
import { EmoteCommand } from "./cmd/emote"
import { EmotegameCommand } from "./cmd/emotegame"
import { EvalCommand } from "./cmd/eval"
import { GithubCommand } from "./cmd/github"
import { HelpCommmand } from "./cmd/help"
import { JoinCommand } from "./cmd/join"
import { LeaveCommand } from "./cmd/leave"
import { LevelCommand } from "./cmd/level"
import { ModCountCommand } from "./cmd/modcount"
import { NotifyCommand } from "./cmd/notify"
import { PingCommand } from "./cmd/ping"
import { RandomColorCommand } from "./cmd/randomcolor"
import { RemoveCommand } from "./cmd/remove"
import { RemovemeCommand } from "./cmd/removeme"
import { RemoveSuggestCommand } from "./cmd/rmsuggestion"
import { SetAliasCommand } from "./cmd/setalias"
import { SetLevelCommand } from "./cmd/setlevel"
import { StatsCommand } from "./cmd/stats"
import { SuggestCommand } from "./cmd/suggest"
import { TimeoutsCommand } from "./cmd/timeouts"
import { UidCommand } from "./cmd/uid"
import { WebsiteCommand } from "./cmd/website"
import { YoinkCommand } from "./cmd/yoink"


const commands: BaseCommand[] = [
  new PingCommand(),
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

export default commands
