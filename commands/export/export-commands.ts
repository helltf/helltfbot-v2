import { ping } from '../cmd/ping.js'
import { github } from '../cmd/github.js'
import { website } from '../cmd/website.js'
import { notify } from '../cmd/notify.js'
import { suggest } from '../cmd/suggest.js'


const commands = [ping, github, website, notify, suggest]
export default commands
