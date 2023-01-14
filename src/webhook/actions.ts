import express from 'express'
import bodyParser from 'body-parser'
import {LogType} from '@src/logger/logger-export'
import {validate, validateMethods} from './validate'
export const app = express()

app.use(validateMethods)
app.use(bodyParser.json())
app.use(validate)

app.post('/', async (req, res) => {
  hb.log(LogType.DEBUG, 'Incoming Webhook message')
  const message = await evaluateWebhook(req.body as WebhookData)
  await hb.sendMessage(hb.config.get('MAIN_USER'), message)
  res.send({})
})

export async function evaluateWebhook(
  data: WebhookData
): Promise<string | undefined> {
  if (data.action !== 'completed') return

  const repo = data.repository.name
  const branch = data.workflow_run.head_branch
  const key = getWebhookKey(repo, branch)
  const lastStatus = await hb.cache.getString(key)
  const status = data.workflow_run.conclusion

  await hb.cache.set(key, status)

  if (lastStatus === 'failure' && status === 'success') {
    return `catJAM 👉 ✅ pipeline in ${repo} on branch ${branch} has been fixed`
  }

  if (status === 'failure') {
    const event = data.workflow_run.event
    return `monkaS 👉❌ pipeline in ${repo} on branch ${branch} failed @helltf (${event})`
  }
}

export function getWebhookKey(repo: string, branch: string): string {
  return `workflow-${repo}-${branch}`
}
export interface Repo {
  id: number
  url: string
  name: string
}

export interface Head {
  ref: string
  sha: string
  repo: Repo
}

export interface Repo2 {
  id: number
  url: string
  name: string
}

export interface Base {
  ref: string
  sha: string
  repo: Repo2
}

export interface PullRequest {
  url: string
  id: number
  number: number
  head: Head
  base: Base
}

export interface Actor {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface TriggeringActor {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface Author {
  name: string
  email: string
}

export interface Committer {
  name: string
  email: string
}

export interface HeadCommit {
  id: string
  tree_id: string
  message: string
  timestamp: Date
  author: Author
  committer: Committer
}

export interface Owner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface Repository {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: Owner
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
}

export interface Owner2 {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface HeadRepository {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: Owner2
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
}

export interface WorkflowRun {
  id: number
  name: string
  node_id: string
  head_branch: string
  head_sha: string
  path: string
  display_title: string
  run_number: number
  event: string
  status: string
  conclusion: string
  workflow_id: number
  check_suite_id: number
  check_suite_node_id: string
  url: string
  html_url: string
  pull_requests: PullRequest[]
  created_at: Date
  updated_at: Date
  actor: Actor
  run_attempt: number
  referenced_workflows: any[]
  run_started_at: Date
  triggering_actor: TriggeringActor
  jobs_url: string
  logs_url: string
  check_suite_url: string
  artifacts_url: string
  cancel_url: string
  rerun_url: string
  previous_attempt_url?: any
  workflow_url: string
  head_commit: HeadCommit
  repository: Repository
  head_repository: HeadRepository
}

export interface Workflow {
  id: number
  node_id: string
  name: string
  path: string
  state: string
  created_at: Date
  updated_at: Date
  url: string
  html_url: string
  badge_url: string
}

export interface Owner3 {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface License {
  key: string
  name: string
  spdx_id: string
  url: string
  node_id: string
}

export interface Repository2 {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: Owner3
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: Date
  updated_at: Date
  pushed_at: Date
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  forks_count: number
  mirror_url?: any
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: License
  allow_forking: boolean
  is_template: boolean
  web_commit_signoff_required: boolean
  topics: string[]
  visibility: string
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
}

export interface Sender {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface WebhookData {
  action: string
  workflow_run: WorkflowRun
  workflow: Workflow
  repository: Repository2
  sender: Sender
}
