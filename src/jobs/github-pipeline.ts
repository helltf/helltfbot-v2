import { PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'
import { ResourceError } from '../api/resource.js'

const counts = new Map<Projects, number | undefined>([
  [Projects.helltfbot_v2, undefined],
  [Projects.bot_v1_fullstack, undefined]
])

const setCount = (project: Projects, value: number) => {
  counts.set(project, value)
}

const updateGithubPipeline = async () => {
  for (const [project, count] of counts) {
    checkForUpdate(project, count)
  }
}

const checkForUpdate = async (project: Projects, count: number | undefined) => {
  const pipelineData = await hb.api.github.getPipeLineData(project)

  if (pipelineData instanceof ResourceError) return

  const { data } = pipelineData

  if (count === undefined) {
    setCount(project, data.count!)
    return
  }

  if (count !== data?.count && data?.status === 'completed') {
    announcePipeLineFinish(data)
    setCount(project, data?.count)
  }
}

function announcePipeLineFinish({
  conclusion,
  repository,
  branch,
  event
}: PipelineData) {
  if (conclusion === 'success') {
    hb.sendMessage(
      process.env.MAIN_USER,
      `catJAM 👉✅ pipeline in ${repository} on branch ${branch} was successful`
    )
  } else if (conclusion === 'failure') {
    hb.sendMessage(
      process.env.MAIN_USER,
      `monkaS 👉❌ pipeline in ${repository} on branch ${branch} failed @helltf (${event})`
    )
  }
}

export { updateGithubPipeline }
