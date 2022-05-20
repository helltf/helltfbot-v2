import { PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'

const counts = new Map<Projects, number>([
  [Projects.helltfbot_v2, undefined],
  [Projects.go_discord_bot, undefined],
  [Projects.inst_mono, undefined]
])

const setCount = (project: Projects, value: number) => {
  counts.set(project, value)
}

const updateGithubPipeline = async () => {
  for (const [project, count] of counts) {
    checkForUpdate(project, count)
  }
}

const checkForUpdate = async (project: Projects, count: number) => {
  const { success, data } = await hb.api.github.getPipeLineData(project)

  if (!success) return

  if (count === undefined) {
    setCount(project, data?.count)
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
