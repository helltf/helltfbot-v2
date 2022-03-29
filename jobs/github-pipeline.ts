import { getPipeLineData, PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'
let count: number = undefined

const getData = async () => {

	let { success, data, error } = await getPipeLineData(Projects.helltfbot_v2)

	if (!success) return

	if (count === undefined) {
		count = data.count
	}

	if (count !== data.count) {
		announceNewPipeLsine(data)
        count = data.count
	}
    
}

function announceNewPipeLine({
	status,
	conclusion,
	repository,
	branch,
}: PipelineData) {
	if (status === 'completed' && conclusion === 'success') {
		console.log(
			`catJAM 👉 pipeline in ${repository} on branch ${branch} was successful`
		)
	} else if (status === 'completed' && conclusion === 'failed') {
        console.log(`monkaS 👉 pipeline in ${repository} on branch ${branch} failed @helltf`)
	}
}

export { getData }
