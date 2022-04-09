import 'jasmine'
import { addNewColor, updateCurrentColors } from './color-tracking.js'

describe('color tracking tests', () => {
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

		let result = updateCurrentColors(initialArray, colorToAdd)
		let expected = [colorToAdd]

		expect(result).toEqual(expected)
	})

	it('update color pushs new color', () => {
		let initialArray = [examples.a, examples.b]

		let result = updateCurrentColors(initialArray, colorToAdd)
		let expected = [examples.a, examples.b, colorToAdd]

		expect(result).toEqual(expected)
	})

	it('add new existing color, changes position', () => {
		let initialArray = [examples.a, colorToAdd, examples.c]

		let result = updateCurrentColors(initialArray, colorToAdd)
		let expected = [examples.a, examples.c, colorToAdd]

		expect(result).toEqual(expected)
	})

    it('array is full splice', () => {
		let initialArray = [examples.a, examples.b, examples.c]

		let result = addNewColor(initialArray, colorToAdd, 3)
		let expected = [examples.b, examples.c, colorToAdd]
        
		expect(result).toEqual(expected)
	})
})
