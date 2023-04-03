import { ResourceError, ResourceSuccess } from '@api/types'
import { BaseCommand } from '@src/commands/base'
import { CommandContext, CommandFlag, MessageType } from '@src/commands/types'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'

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

    it('command has one required param and one optional param return params with both values', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['req_param'] as const
        optionalParams = ['opt_param'] as const
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
        req_param: paramValue1,
        opt_param: paramValue2
      })
    })

    it('command has flag append append values to last param', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['param'] as const
        optionalParams = [] as const
        flags = [CommandFlag.APPEND_PARAMS]
      }

      const paramValue = ['ab', 'dc', 'fg', 'hi']

      const result = new TestBaseCommand().buildContext({
        user,
        message: paramValue,
        type: MessageType.MESSAGE,
        where: channel
      })

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<
        CommandContext<TestBaseCommand>
      >
      expect(data.params).toStrictEqual({
        param: paramValue.join(' ')
      })
    })

    it('command has flag append append values to last param but two params given', () => {
      class TestBaseCommand extends BaseCommand {
        requiredParams = ['first'] as const
        optionalParams = ['second'] as const
        flags = [CommandFlag.APPEND_PARAMS]
      }

      const firstParamValue = 'firstValue'
      const restParamValues = ['ab', 'dc', 'fg', 'hi']

      const result = new TestBaseCommand().buildContext({
        user,
        message: [firstParamValue, ...restParamValues],
        type: MessageType.MESSAGE,
        where: channel
      })

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<
        CommandContext<TestBaseCommand>
      >
      expect(data.params).toStrictEqual({
        first: firstParamValue,
        second: restParamValues.join(' ')
      })
    })
  })
  describe('evaluate', () => {
    it('context is not whisper return ResourceSuccess', () => {
      class TestBaseCommand extends BaseCommand {
        flags = []
      }

      const context = {
        message: [''],
        type: MessageType.MESSAGE,
        user: getExampleTwitchUserState({})
      }

      const result = new TestBaseCommand().evaluate(context)

      expect(result).toBeInstanceOf(ResourceSuccess)
    })

    it('context is whisper but command doesnt allow whisper return error', () => {
      class TestBaseCommand extends BaseCommand {
        flags = []
      }

      const context = {
        message: [''],
        type: MessageType.WHISPER,
        user: getExampleTwitchUserState({})
      }

      const result = new TestBaseCommand().evaluate(context)

      expect(result).toBeInstanceOf(ResourceError)
    })

    it('conext is whipser and command allows whisper return true', () => {
      class TestBaseCommand extends BaseCommand {
        flags = [CommandFlag.WHISPER]
      }

      const context = {
        message: [''],
        type: MessageType.WHISPER,
        user: getExampleTwitchUserState({})
      }

      const result = new TestBaseCommand().evaluate(context)

      expect(result).toBeInstanceOf(ResourceSuccess)
    })

    it('user has not enough perms return error')
  })
})
