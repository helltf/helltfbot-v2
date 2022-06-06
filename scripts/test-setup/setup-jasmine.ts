import 'dotenv/config'
import Jasmine from 'jasmine'
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter'

const setupJasmine = (): Jasmine => {
  process.env.NODE_ENV = 'test'
  const jasmine = new Jasmine()
  jasmine.env.clearReporters()
  jasmine.addReporter(
    new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.PRETTY
      }
    })
  )

  return jasmine
}

export default setupJasmine

