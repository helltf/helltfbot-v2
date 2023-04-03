export class LanguageService {
  pluralizeIf(input: string, someNumber: number) {
    return someNumber === 1 ? input : this.pluralize(input)
  }

  pluralize = (input: string): string => input + 's'
}
