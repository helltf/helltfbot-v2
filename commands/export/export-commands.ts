import { ping } from '../cmd/ping.js'
import { github } from '../cmd/github.js'
import { website } from '../cmd/website.js'
import { notify } from '../cmd/notify.js'
import { suggest } from '../cmd/suggest.js'
import { rmsuggest } from '../cmd/rmsuggestion.js'
import { join } from '../cmd/join.js'
import { Command } from './types.js'
import { leave } from '../cmd/leave.js'

const commands: Command[] = [
  ping,
  github,
  website,
  notify,
  suggest,
  rmsuggest,
  join,
  leave
]
export default commands
