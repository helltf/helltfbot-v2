import { hb } from './../helltfbot.js'
import { getPipeLineData, PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'
let count: number = undefined

const getData = async () => {
	let { success, data, error } = await getPipeLineData(Projects.helltfbot_v2)

	if (!success) return

	if (count === undefined) {
		count = data.count
	}

	if (count !== data.count && data.status === 'completed') {
		announceNewPipeLine(data)
		count = data.count
	}
}

function announceNewPipeLine({ conclusion, repository, branch }: PipelineData) {
	if (conclusion === 'success') {
		hb.client.say(
			'helltf',
			`catJAM 👉 pipeline in ${repository} on branch ${branch} was successful`
		)
	} else if (conclusion === 'failure') {
		hb.client.say(
			'helltf',
			`monkaS 👉 pipeline in ${repository} on branch ${branch} failed @helltf`
		)
	}
}

export { getData }
