import { Command } from './command.js'
import { readdir } from 'fs/promises'

const getCommandInfo = (module: any): any => {
	return Object.entries(module)[0][1]
}



const loadCommands = async (): Promise<Command[]> => {
    let commands: Command[] = []
	let commandDir = await readdir('./dist/commands/cmd')
    console.log(__dirname)
    for(let command of commandDir){
        let importedCommand = (await import('../cmd/' + command))
        commands.push(getCommandInfo(importedCommand))
    }
    
    return commands
}

export { loadCommands }
