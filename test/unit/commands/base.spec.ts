import { ResourceError, ResourceSuccess } from '@api/types'
import { BaseCommand } from '@src/commands/base'
import { CommandContext, MessageType } from '@src/commands/types'
import { getExampleTwitchUserState } from '@test-utils/example'

describe('base command', () => {
  describe('build context', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('required params amount is not given return error', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['test'] as const
        optionalParams = [] as const
      }

      const test = new TestBaseCommand()

      const result = test.buildContext({
        user,
        type: MessageType.MESSAGE,
        message: [],
        where: channel
      })

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError
      expect(error).toBe('Missing param test')
    })

    it('command has no params return empty object', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = [] as const
        optionalParams = [] as const
      }

      const result = new TestBaseCommand().buildContext({
        user,
        message: [],
        where: channel,
        type: MessageType.MESSAGE
      })

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<
        CommandContext<TestBaseCommand>
      >

      expect(data.params).toStrictEqual({})
    })

    it('command has one param return object with param and value', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['test'] as const
        optionalParams = [] as const
      }
      const paramValue = 'value'

      const result = new TestBaseCommand().buildContext({
        user,
        message: [paramValue],
        where: channel,
        type: MessageType.MESSAGE
      })

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<
        CommandContext<TestBaseCommand>
      >

      expect(data.params).toStrictEqual({
        test: paramValue
      })
    })

    it('command has two required params return object with both params', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['param1', 'param2'] as const
        optionalParams = [] as const
      }
      const paramValue1 = 'value1'
      const paramValue2 = 'value2'

      const result = new TestBaseCommand().buildContext({
        user,
        message: [paramValue1, paramValue2],
        where: channel,
        type: MessageType.MESSAGE
      })

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<
        CommandContext<TestBaseCommand>
      >

      expect(data.params).toStrictEqual({
        param1: paramValue1,
        param2: paramValue2
      })
    })
  })
})
