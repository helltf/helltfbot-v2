import { ChatUserstate } from 'tmi.js'
import { Module } from './export/module.js'

export class ColorTracking implements Module {
  name = 'Color'
  MAX_SAVED_COLORS = 15
  async initialize() {
    hb.client.on(
      'chat',
      async (
        _: string,
        { 'user-id': userId, color: userColor }: ChatUserstate
      ) => {
        const savedColors = (
          await hb.db.userRepo.findOne({
            where: { id: Number(userId) },
            relations: {
              colors: true
            }
          })
        )?.colors?.history

        if (!savedColors) {
          hb.db.colorRepo.save({
            twitch_id: Number(userId),
            history: [userColor],
            change_timestamp: Date.now(),
            register_timestamp: Date.now()
          })
          return
        }

        const latestColor = savedColors[savedColors.length - 1]

        if (latestColor !== userColor) {
          const updatedColors = this.updateCurrentColors(savedColors, userColor)

          hb.db.colorRepo.save({
            twitch_id: Number(userId),
            history: updatedColors,
            change_timestamp: Date.now()
          })
        }
      }
    )
  }
  setNewPosition(colors: string[], newColor: string): string[] {
    const index = colors.findIndex((c) => c === newColor)
    colors.splice(index, 1)
    colors.push(newColor)
    return colors
  }
  addNewColor(
    colors: string[],
    newColor: string,
    max: number = this.MAX_SAVED_COLORS
  ): string[] {
    if (colors.length < max) {
      colors.push(newColor)
    } else {
      colors.splice(0, 1)
      colors.push(newColor)
    }

    return colors
  }
  updateCurrentColors(colors: string[], newColor: string): string[] {
    if (colors.includes(newColor)) {
      return this.setNewPosition(colors, newColor)
    }

    return this.addNewColor(colors, newColor)
  }
}
