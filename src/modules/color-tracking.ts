import { ChatUserstate } from 'tmi.js'
import { Module } from './export/module.js'

export class ColorTracking implements Module {
  name: string = 'Color'
  MAX_SAVED_COLORS: number = 15

  async initialize() {
    hb.client.on('chat', (c: string, u: ChatUserstate) => {
      this.handleColorChanges(c, u)
    })
  }

  async handleColorChanges(
    _: string,
    { 'user-id': userId, color: userColor }: ChatUserstate
  ) {
    if (!userId) return
    const id = Number(userId)

    const savedColors = (
      await hb.db.userRepo.findOne({
        where: { id: id },
        relations: {
          colors: true
        }
      })
    )?.colors?.history

    if (!savedColors) {
      hb.db.colorRepo.save({
        user: {
          id: id
        },
        history: [userColor],
        change_timestamp: Date.now(),
        register_timestamp: Date.now()
      })
      return
    }

    const latestColor = savedColors[savedColors.length - 1]

    if (latestColor !== userColor) {
      const updatedColors = this.updateCurrentColors(savedColors, userColor)

      hb.db.colorRepo.update(
        {
          user: {
            id: id
          }
        },
        {
          history: updatedColors,
          change_timestamp: Date.now()
        }
      )
    }
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
