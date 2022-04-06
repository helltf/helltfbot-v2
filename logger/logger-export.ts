
import chalk from 'chalk';
import { format } from 'date-fns'

const getCurrentDateString = (): string => {
    return `[${format(new Date(Date.now()), 'yyyy-MM-dd hh:mm')}]`
}

const log = (...args: any) => {
    console.log(`${chalk.green(getCurrentDateString())}: ${chalk.magenta(`[TWITCHBOT]`)} -> ${args}`)
}


export{log as customLogMessage}
