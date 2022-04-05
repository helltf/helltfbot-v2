
import chalk from 'chalk';
import { Temporal } from "proposal-temporal"; 

const log = (...args: any) => {
    console.log(Temporal.now.instant())
}


export{log as customLogMessage}
