export interface Module {
  initialize: (...params: any) => any | Promise<any>
  name: string
}
