import { ResourceError,  ResourceSuccess } from '@api/types'
import { PingCommand } from '@src/commands/cmd/ping'
import { setup } from '@test-utils/setup'

describe('test', () => {
  let initialGlobal: any
  // @ts-ignore
  globalThis.hb = undefined
  beforeEach(() => {
    // @ts-ignore
    globalThis.hb = undefined
    initialGlobal = global
    setup()
  })
  afterEach(() => {
    console.log(hb)
    global = initialGlobal
  })
  it('test runs', () => {
    jest.spyOn(hb.commands, 'findCommand').mockReturnValue(new PingCommand())

    expect(hb).not.toBeUndefined()
  })
})
