import { updateGithubPipeline } from './github-pipeline'

class Job {
  delay: number
  execute: () => any

  constructor(delay: number, execute: () => any) {
    this.delay = delay
    this.execute = execute
  }
}

const jobs: Job[] = [new Job(60000, updateGithubPipeline)]

export default jobs
