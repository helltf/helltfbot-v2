import { updateCurrentColors } from "./color-tracking"

test('update color pushs new color', () => {
    let initialArray = []
    let colorToAdd = '#ffffff'
    let result = updateCurrentColors(initialArray, colorToAdd)

    expect(result).toBe([colorToAdd])
})