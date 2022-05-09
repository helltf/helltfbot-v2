import { ChatUserstate } from 'tmi.js'
import { Module } from './export/module.js'

export class ColorTracking implements Module {
  name: string = 'Color'
  MAX_SAVED_COLORS = 15
  async initialize() {
    hb.watchclient.on(
      'chat',
      async (
        channel: string,
        { 'user-id': userId, color: userColor }: ChatUserstate,
        message: string,
        self: boolean
      ) => {
        let savedColors = (
          await hb.db.colorRepo.findOneBy({
            twitch_id: Number(userId)
          })
        )?.history

        if (!savedColors) {
          hb.db.colorRepo.save({
            twitch_id: Number(userId),
            history: [userColor],
            change_timestamp: Date.now(),
            register_timestamp: Date.now()
          })
          return
        }

        let latestColor = savedColors[savedColors.length - 1]

        if (latestColor !== userColor) {
          let updatedColors = this.updateCurrentColors(savedColors, userColor)

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
    let index = colors.findIndex((c) => c === newColor)
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
