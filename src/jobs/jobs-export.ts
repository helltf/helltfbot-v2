import { getDeps } from 'deps'
import { Job } from './job'
import { ReminderJob } from './reminder.job'


export const startJobs = async (): Promise<Job[]> => {
  const deps = getDeps()
  return [new ReminderJob(deps.reminder, deps.utils)]
}
