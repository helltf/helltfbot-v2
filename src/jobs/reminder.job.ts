import { Job } from './job'

export class ReminderJob implements Job {
  delay = 5000
  execute = () => {}
}
