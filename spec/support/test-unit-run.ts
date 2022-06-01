import Jasmine from 'jasmine'

process.env.NODE_ENV = 'test'
const jasmine = new Jasmine()
jasmine.loadConfigFile('spec/support/jasmine-unit.json')
jasmine.execute()
