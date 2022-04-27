
import chalk from 'chalk';
import { format } from 'date-fns'
import { LogType } from './log-type.js';

const getEnumKey = (type: LogType) => Object.keys(LogType)[Object.values(LogType).indexOf(type)]

const getCurrentDateString = (): string => {
    return `[${format(new Date(Date.now()), 'yyyy-MM-dd hh:mm')}]`
}

const log = (type: LogType, ...args: any) => {
    let typeName = getEnumKey(type)
    console.log(`${chalk.green(getCurrentDateString())}: ${chalk.hex(type)(`[${typeName}]`)} -> ${args}`)
}


export{log as customLogMessage}
