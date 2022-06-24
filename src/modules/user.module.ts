import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { ChatUserstate } from 'tmi.js'
import { Module } from './export/module'

export class ColorTracking implements Module {
  name = 'Color'
  MAX_SAVED_COLORS = 15

  async initialize() {
    hb.client.on('chat', async (_0, user: ChatUserstate, _1, self) => {
      if (self) return
      await this.updateUser(user)
      await this.handleColorChanges(user)
    })
  }

  async handleColorChanges({
    'user-id': userId,
    color: userColor
  }: ChatUserstate) {
    if (!userId) return
    const id = Number(userId)

    const savedColors = (
      await hb.db.userRepo.findOne({
        where: {
          id: id
        },
        relations: {
          colors: true
        }
      })
    )?.colors?.history

    if (!savedColors) {
      return this.saveNewHistory(id, userColor!)
    }

    const latestColor = savedColors[savedColors.length - 1]

    if (latestColor !== userColor) {
      const updatedColors = this.updateCurrentColors(savedColors, userColor!)

      this.updateDatabaseColors(id, updatedColors)
    }
  }

  updateDatabaseColors(userId: number, colors: string[]) {
    hb.db.colorRepo.update(
      {
        user: {
          id: userId
        }
      },
      {
        history: colors,
        change_timestamp: Date.now()
      }
    )
  }

  async saveNewHistory(userId: number, color: string) {
    await hb.db.colorRepo.save({
      user: {
        id: userId
      },
      history: [color],
      change_timestamp: Date.now(),
      register_timestamp: Date.now()
    })
  }

  setNewPosition(colors: string[], newColor: string): string[] {
    const index = colors.findIndex(c => c === newColor)
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

  async updateUser(user: ChatUserstate) {
    const id = parseInt(user['user-id']!)

    const userEntry = await hb.db.userRepo.findOneBy({
      id: id
    })

    if (userEntry) {
      return await hb.db.userRepo.update(
        {
          id: id
        },
        {
          color: user.color,
          display_name: user['display-name'],
          name: user.username
        }
      )
    }

    await hb.db.userRepo.save({
      color: user.color,
      display_name: user['display-name'],
      name: user.username,
      id: id,
      notifications: [],
      permission: GlobalPermissionLevel.USER,
      registered_at: Date.now()
    })
  }
}
