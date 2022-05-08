import { ping } from '../cmd/ping.js'
import { github } from '../cmd/github.js'
import { website } from '../cmd/website.js'
import { notify } from '../cmd/notify.js'
import { suggest } from '../cmd/suggest.js'
import { rmsuggest } from '../cmd/rmsuggestion.js'


const commands = [ping, github, website, notify, suggest, rmsuggest]
export default commands
