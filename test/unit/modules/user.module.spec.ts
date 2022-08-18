import { ColorTracking } from '@modules/user.module'

describe('color tracking tests', () => {
  let module: ColorTracking

  beforeEach(() => {
    module = new ColorTracking()
  })

  const examples = {
    a: '#aaaaaa',
    b: '#bbbbbb',
    c: '#cccccc',
    d: '#dddddd',
    e: '#eeeeee',
    f: '#ffffff'
  }

  const colorToAdd = '#zzzzzz'

  it('update color pushs new color', () => {
    const initialArray: string[] = []

    const result = module.updateCurrentColors(initialArray, colorToAdd)
    const expected = [colorToAdd]

    expect(result).toEqual(expected)
  })

  it('update color pushs new color', () => {
    const initialArray = [examples.a, examples.b]

    const result = module.updateCurrentColors(initialArray, colorToAdd)
    const expected = [examples.a, examples.b, colorToAdd]

    expect(result).toEqual(expected)
  })

  it('add new existing color, changes position', () => {
    const initialArray = [examples.a, colorToAdd, examples.c]

    const result = module.updateCurrentColors(initialArray, colorToAdd)
    const expected = [examples.a, examples.c, colorToAdd]

    expect(result).toEqual(expected)
  })

  it('array is full splice', () => {
    const initialArray = [examples.a, examples.b, examples.c]

    const result = module.addNewColor(initialArray, colorToAdd, 3)
    const expected = [examples.b, examples.c, colorToAdd]

    expect(result).toEqual(expected)
  })
})
