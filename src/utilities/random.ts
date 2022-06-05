export const random = (lowerLimit = 0, upperLimit = 1) => {
  return Math.floor(Math.random() * upperLimit) + lowerLimit
}
