import 'jasmine'
import { mapTime } from '../../../src/utilities/wait'

describe('test timeout mappings', () => {
  it('1ms should return 1', () => {
    const result = mapTime('1ms')
    const expected = 1

    expect(result).toBe(expected)
  })

  it('10ms should return 10', () => {
    const result = mapTime('10ms')
    const expected = 10

    expect(result).toBe(expected)
  })

  it('100ms should return 100', () => {
    const result = mapTime('100ms')
    const expected = 100

    expect(result).toBe(expected)
  })

  it('value missing throws error', () => {
    const fn = () => {
      mapTime('ms')
    }

    expect(fn).toThrowError()
  })
  it('unit missing throws error', () => {
    const fn = () => {
      mapTime('1')
    }

    expect(fn).toThrowError()
  })
  it('input missing throws error', () => {
    const fn = () => {
      mapTime('')
    }

    expect(fn).toThrowError()
  })

  it('1s should return 1000', () => {
    const result = mapTime('1s')
    const expected = 1000

    expect(result).toBe(expected)
  })
  it('5s should return 5000', () => {
    const result = mapTime('5s')
    const expected = 5000

    expect(result).toBe(expected)
  })

  it('1m should return 60000', () => {
    const result = mapTime('1m')
    const expected = 60000

    expect(result).toBe(expected)
  })

  it('1h should return 360000', () => {
    const result = mapTime('1h')
    const expected = 3600_000

    expect(result).toBe(expected)
  })

  it('1d should return 8640000', () => {
    const result = mapTime('1d')
    const expected = 86_400_000

    expect(result).toBe(expected)
  })
})
