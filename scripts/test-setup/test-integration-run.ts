import setupJasmine from './setup-jasmine'

const jasmine = setupJasmine()

jasmine.loadConfigFile('spec/support/jasmine-integration.json')
jasmine.execute()
