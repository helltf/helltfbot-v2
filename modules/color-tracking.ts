import { ChatUserstate } from 'tmi.js'
import { hb } from '../helltfbot.js'

const maxSavedColors = 15

const init = () => {
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
					twitch_id: Number(userId),
				})
			)?.history

			if (!savedColors) {
				hb.db.colorRepo.save({
					twitch_id: Number(userId),
					history: [userColor],
					change_timestamp: Date.now(),
					register_timestamp: Date.now(),
				})
				return
			}

			let latestColor = savedColors[savedColors.length - 1]

			if (latestColor !== userColor) {
				let updatedColors = updateCurrentColors(savedColors, userColor)

				hb.db.colorRepo.save({
					twitch_id: Number(userId),
					history: updatedColors,
					change_timestamp: Date.now(),
				})
			}
		}
	)
}

function updateCurrentColors(colors: string[], newColor: string): string[] {
	if (colors.includes(newColor)) {
		return setNewPosition(colors, newColor)
	}

	return addNewColor(colors, newColor)
}

function addNewColor(colors: string[], newColor: string): string[] {
	if (colors.length < maxSavedColors) {
		colors.push(newColor)
	} else {
		colors.splice(0, 1)
        colors.push(newColor)
	}

	return colors
}

function setNewPosition(colors: string[], newColor: string): string[] {
	let index = colors.findIndex((c) => c === newColor)
	colors.splice(index, 1)
    colors.push(newColor)
	return colors
}

export { init, updateCurrentColors }
