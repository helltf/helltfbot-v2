import 'jasmine'
import { ColorTracking } from '../../modules/color-tracking.js';

describe('color tracking tests', () => {
	let module: ColorTracking

	beforeEach(() => {
		module = new ColorTracking()
	})

	let examples = {
		a: '#aaaaaa',
		b: '#bbbbbb',
		c: '#cccccc',
		d: '#dddddd',
		e: '#eeeeee',
		f: '#ffffff',
	}

	let colorToAdd = '#zzzzzz'

	it('update color pushs new color', () => {
		let initialArray = []

		let result = module.updateCurrentColors(initialArray, colorToAdd)
		let expected = [colorToAdd]

		expect(result).toEqual(expected)
	})

	it('update color pushs new color', () => {
		let initialArray = [examples.a, examples.b]

		let result = module.updateCurrentColors(initialArray, colorToAdd)
		let expected = [examples.a, examples.b, colorToAdd]

		expect(result).toEqual(expected)
	})

	it('add new existing color, changes position', () => {
		let initialArray = [examples.a, colorToAdd, examples.c]

		let result = module.updateCurrentColors(initialArray, colorToAdd)
		let expected = [examples.a, examples.c, colorToAdd]

		expect(result).toEqual(expected)
	})

    it('array is full splice', () => {
		let initialArray = [examples.a, examples.b, examples.c]

		let result = module.addNewColor(initialArray, colorToAdd, 3)
		let expected = [examples.b, examples.c, colorToAdd]
        
		expect(result).toEqual(expected)
	})
})
