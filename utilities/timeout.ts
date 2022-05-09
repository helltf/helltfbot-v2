const mappings = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
}

const mapTime = (string: string): number => {
  let splitIndex = string.search(/\D+/gim)
  let number = Number(string.substring(0, splitIndex))
  let unit = string.substring(splitIndex, string.length)

  if (!number || !unit)
    throw new Error('Unit or number is not correct in the given input')
  return mappings[unit] * number
}

const wait = ([time]: TemplateStringsArray): Promise<any> =>
  new Promise((res) => setTimeout(res, mapTime(time)))

export { wait, mapTime }
