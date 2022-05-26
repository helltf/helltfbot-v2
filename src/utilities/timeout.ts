const mappings = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
}

enum TimeoutLengths {
  MS = 1,
  S = 1000,
  M = 60 * 1000,
  H = 60 * 60 * 1000,
  D = 24 * 60 * 60 * 1000
}

const mapUnits = (unit: string): number => {
  if (unit === 'ms') return TimeoutLengths.MS
  if (unit === 's') return TimeoutLengths.S
  if (unit === 'm') return TimeoutLengths.M
  if (unit === 'h') return TimeoutLengths.H
  if (unit === 'd') return TimeoutLengths.D
  throw new Error("Unknown unit mapping")
}

const mapTime = (string: string): number => {
  const splitIndex = string.search(/\D+/gim)
  const number = Number(string.substring(0, splitIndex))
  const unit = string.substring(splitIndex, string.length)

  if (!number || !unit)
    throw new Error('Unit or number is not correct in the given input')
  return mapUnits(unit) * number
}

const wait = ([time]: TemplateStringsArray): Promise<NodeJS.Timeout> =>
  new Promise((res) => setTimeout(res, mapTime(time)))

export { wait, mapTime }
