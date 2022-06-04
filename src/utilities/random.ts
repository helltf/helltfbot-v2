export const random = (lowerLimit: number = 0, upperLimit: number = 1) => {
  return Math.floor(Math.random() * upperLimit) + lowerLimit
}
