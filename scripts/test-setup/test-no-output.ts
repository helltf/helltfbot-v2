import 'dotenv/config'
import Jasmine from 'jasmine'
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter'

process.env.NODE_ENV = 'test'
const jasmine = new Jasmine()
jasmine.env.clearReporters()
jasmine.addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE,
            displayErrorMessages: false,
            displayFailed: false,
            displayPending: false,
            displayDuration: false,
            displaySuccessful: false
        }
    })
)
jasmine.loadConfigFile('spec/support/jasmine.json')
jasmine.execute()
