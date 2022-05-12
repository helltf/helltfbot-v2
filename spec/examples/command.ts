import { Command } from '../../commands/export/types.js'

export const exampleCommand = new Command({
  name: 'example',
  cooldown: 1000,
  description: 'example',
  execute: async () => {
    return { response: '', channel: '', success: true }
  },
  optionalParams: [],
  requiredParams: [],
  permissions: 5,
  alias: []
})
