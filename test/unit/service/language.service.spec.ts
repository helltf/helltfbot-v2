import { LanguageService } from "@src/services/language.service"

describe('language service', () => {
  let service: LanguageService

  beforeEach(() => {
    service = new LanguageService()
  })

  describe('plularize function', () => {
    it('pluralize appends s to input', () => {
      const input = 'test'
      const result = service.plularize(input)

      expect(result).toBe(input + 's')
    })
  })

  describe('pluralize if', () => {
    it('value is not 1 return input in plural', () => {
      const input = 'test'
      const someNumber = 0
      const result = service.plularizeIf(input, someNumber)

      expect(result).toBe(input + 's')
    })

    it('value is 1 return same input', () => {
      const input = 'Test'
      const someNumber = 1

      const result = service.plularizeIf(input, someNumber)

      expect(result).toBe(input)
    })
  })
})
