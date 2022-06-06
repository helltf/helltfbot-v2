import setupJasmine from './setup-jasmine'

const jasmine = setupJasmine()
jasmine.loadConfigFile('spec/support/jasmine-unit.json')
jasmine.execute()
