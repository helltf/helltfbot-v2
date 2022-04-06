import { hb } from './../helltfbot.js'
import { getPipeLineData, PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'

let counts = new Map<Projects, number>([
	[Projects.helltfbot_v2, undefined],
	[Projects.go_discord_bot, undefined],
	[Projects.inst_mono, undefined],
])

const setCount = (project: Projects, value: number) => {
	counts.set(project, value)
}

const updateGithubPipeline = async () => {
	for (let [project, count] of counts) {
		checkForUpdate(project, count)
	}
}

const checkForUpdate = async (project: Projects, count: number) => {
	let { success, data } = await getPipeLineData(project)

	if (!success) return

	if (count === undefined) {
		setCount(project, data.count)
		return
	}

	if (count !== data.count && data.status === 'completed') {
		announcePipeLineFinish(data)
		setCount(project, data.count)
	}
}

function announcePipeLineFinish({ conclusion, repository, branch, event }: PipelineData) {
	if (conclusion === 'success') {
		hb.client.say(
			'helltf',
			`catJAM 👉🟢 pipeline in ${repository} on branch ${branch} was successful`
		)
	} else if (conclusion === 'failure') {
		hb.client.say(
			'helltf',
			`monkaS 👉🔴 pipeline in ${repository} on branch ${branch} failed @helltf (${event})`
		)
	}
}

export { updateGithubPipeline }
