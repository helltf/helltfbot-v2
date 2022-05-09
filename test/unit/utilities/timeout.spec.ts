import 'jasmine'
import { mapTime } from '../../../utilities/timeout.js'

describe('test timeout mappings', () => {
  it('1ms should return 1', () => {
    let result = mapTime('1ms')
    let expected = 1

    expect(result).toBe(expected)
  })

  it('10ms should return 10', () => {
    let result = mapTime('10ms')
    let expected = 10

    expect(result).toBe(expected)
  })

  it('100ms should return 100', () => {
    let result = mapTime('100ms')
    let expected = 100

    expect(result).toBe(expected)
  })

  it('value missing throws error', () => {
    let fn = () => {
      mapTime('ms')
    }

    expect(fn).toThrowError()
  })
  it('unit missing throws error', () => {
    let fn = () => {
      mapTime('1')
    }

    expect(fn).toThrowError()
  })
  it('input missing throws error', () => {
    let fn = () => {
      mapTime('')
    }

    expect(fn).toThrowError()
  })

  it('1s should return 1000', () => {
    let result = mapTime('1s')
    let expected = 1000

    expect(result).toBe(expected)
  })
  it('5s should return 5000', () => {
    let result = mapTime('5s')
    let expected = 5000

    expect(result).toBe(expected)
  })

  it('1m should return 60000', () => {
    let result = mapTime('1m')
    let expected = 60000

    expect(result).toBe(expected)
  })

  it('1h should return 360000', () => {
    let result = mapTime('1h')
    let expected = 3600_000

    expect(result).toBe(expected)
  })

  it('1d should return 8640000', () => {
    let result = mapTime('1d')
    let expected = 86_400_000

    expect(result).toBe(expected)
  })
})
