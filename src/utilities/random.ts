export const random = (lowerLimit = 0, upperLimit = 1): number => {
  return Math.floor(Math.random() * (upperLimit + lowerLimit + 1))
}
