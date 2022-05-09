import { Resource } from '../resource.js'
import fetch from 'node-fetch'
import { Projects } from './github-projects.js'

const getPipeLineData = async (
  project: Projects
): Promise<Resource<PipelineData>> => {
  try {
    let data = await requestGithubApi(project)
    return Resource.ok(new PipelineData(data, project))
  } catch (e) {
    return Resource.error(e)
  }
}

const requestGithubApi = async (path: string): Promise<any> => {
  return await (
    await fetch(path, {
      method: 'GET',
      headers: {
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    })
  ).json()
}

export class PipelineData {
  count: number
  branch: string
  status: string
  conclusion: string
  repository: string
  project: Projects
  event: string

  constructor({ workflow_runs, total_count }: any, project: Projects) {
    let { head_branch, status, conclusion, repository, event } =
      workflow_runs[0]

    this.count = total_count
    this.branch = head_branch
    this.status = status
    this.conclusion = conclusion
    this.repository = repository.name
    this.project = project
    this.event = event
  }
}

export { getPipeLineData }
