export class Job {
  delay: number
  execute: () => any

  constructor(delay: number, execute: () => any) {
    this.delay = delay
    this.execute = execute
  }
}
