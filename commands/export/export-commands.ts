import { ping } from '../cmd/ping.js'
import { github } from '../cmd/github.js'
import { website } from '../cmd/website.js'
import { notify } from '../cmd/notify.js'


const commands = [ping, github, website, notify]
export default commands
