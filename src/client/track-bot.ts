import { IdentityOptions } from '../config/config.js'
import { Client } from 'tmi.js'

const watchClient = createWatchClient()

function createWatchClient() {
  const watchClientOptions = new IdentityOptions('sajkdkjls', 'justinfan284')
  return Client({ identity: watchClientOptions })
}

export { watchClient }
