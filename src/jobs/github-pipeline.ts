import { PipelineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'
import { ResourceError } from '../api/types.js'

interface ProjectInfo {
  count: number | undefined
  latestStatus: string | undefined
}

const counts = new Map<Projects, ProjectInfo>([
  [Projects.helltfbot_v2, { count: undefined, latestStatus: undefined }],
  [Projects.bot_v1_fullstack, { count: undefined, latestStatus: undefined }]
])

const setInfo = (project: Projects, value: number, status: string) => {
  counts.set(project, { count: value, latestStatus: status })
}

const updateGithubPipeline = async () => {
  for (const [project, info] of counts) {
    checkForUpdate(project, info)
  }
}

const checkForUpdate = async (
  project: Projects,
  { count, latestStatus }: ProjectInfo
) => {
  const pipelineData = await hb.api.github.getPipeLineData(project)

  if (pipelineData instanceof ResourceError) return

  const { data } = pipelineData

  if (count === undefined) {
    setInfo(project, data.count, data.status)
    return
  }

  if (count !== data?.count && data?.status === 'completed') {
    announcePipeLineFinish(data, latestStatus)
    setInfo(project, data?.count, data.conclusion)
  }
}

function announcePipeLineFinish(
  { conclusion, repository, branch, event }: PipelineData,
  latestStatus: string | undefined
) {
  if (conclusion === 'success' && latestStatus === 'failure') {
    return hb.sendMessage(
      hb.config.get('MAIN_USER'),
      `catJAM 👉✅ pipeline in ${repository} on branch ${branch} has been fixed`
    )
  }
  if (conclusion === 'failure') {
    return hb.sendMessage(
      hb.config.get('MAIN_USER'),
      `monkaS 👉❌ pipeline in ${repository} on branch ${branch} failed @helltf (${event})`
    )
  }
}

export { updateGithubPipeline }
