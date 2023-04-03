export function getEnumValues(anyEnum: any): any[] {
  return Object.keys(anyEnum)
    .filter(v => !isNaN(Number(v)))
    .map(v => Number(v))
}
