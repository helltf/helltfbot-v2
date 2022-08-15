import { setup } from "@test-utils/setup"

describe('pluralize', () => {
    beforeEach(setup)

    it('pluralize appends s to input', () => {
        const input = 'test'
        const result = hb.utils.plularize(input)

        expect(result).toBe(input + 's')
    })
})

describe('pluralize if', () => {
    it('value is not 1 return input in plural', () => {
        const input = 'test'
        const someNumber = 0
        const result = hb.utils.plularizeIf(input, someNumber)

        expect(result).toBe(input + 's')
    })

    it('value is 1 return same input', () => {
        const input = 'Test'
        const someNumber = 1

        const result = hb.utils.plularizeIf(input, someNumber)

        expect(result).toBe(input)
    })
})