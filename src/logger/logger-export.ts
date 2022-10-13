import chalk from 'chalk'
import { format } from 'date-fns'

const getEnumKey = (type: LogType) =>
  Object.keys(LogType)[Object.values(LogType).indexOf(type)]

const getCurrentDateString = (): string => {
  return `[${format(new Date(Date.now()), 'yyyy-MM-dd hh:mm')}]`
}

const log = (type: LogType, ...args: any) => {
  const typeName = getEnumKey(type)
  console.log(
    `${chalk.green(getCurrentDateString())}: ${chalk.hex(type)(
      `[${typeName}]`
    )} -> ${args}`
  )
}

export enum LogType {
  TWITCHBOT = '#FF00FF',
  MODULE = '#eb4034',
  JOBS = '#34ebc6',
  PUBSUB = '#00ad9c',
  ERROR = '#ff3333',
  INFO = '#FFBA01'
}

export { log as customLogMessage }
