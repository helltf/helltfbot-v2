import {evaluateWebhook, getWebhookKey, WebhookData} from "@src/webhook/actions"
import {setupDatabase} from "@test-utils/setup-db"
import {clearDb, clearRedis} from '@test-utils/clear'
import { disconnectRedis, disconnectDatabase } from '@test-utils/disconnect'

describe('github action webhook', () => {
  const branch = 'testbranch'
  const repo = 'testrepo'

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb(hb.db.dataSource)
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectDatabase()
    await disconnectRedis()
  })

  it('get webhook function returns key containing repo and branch', () => {
    const result = getWebhookKey(repo, branch)

    expect(result).toBe(`workflow-${repo}-${branch}`)
  })

  it('action is not completed return undefined', async () => {
    const data: WebhookData = {
      action: 'in_progress',
      workflow_run: { conclusion: 'success', head_branch: branch },
      repository: { name: repo }
    } as WebhookData

    const result = await evaluateWebhook(data)

    expect(result).toBeUndefined()
  })

  it('action is completed and successful return undefined', async () => {
    const data: WebhookData = {
      action: 'completed',
      workflow_run: { conclusion: 'success', head_branch: branch },
      repository: { name: repo }
    } as WebhookData

    const result = await evaluateWebhook(data)

    expect(result).toBeUndefined()
  })

  it('action is completed but last run failed return fixed message', async () => {
    const data: WebhookData = {
      action: 'completed',
      workflow_run: { conclusion: 'success', head_branch: branch },
      repository: { name: repo }
    } as WebhookData

    await hb.cache.set(getWebhookKey(repo, branch), 'failure')

    const result = await evaluateWebhook(data)
    expect(result).toBe(
      `catJAM 👉 ✅ pipeline in ${repo} on branch ${branch} has been fixed`
    )

    const savedStatus = await hb.cache.getString(getWebhookKey(repo, branch))
    expect(savedStatus).toBe(data.workflow_run.conclusion)
  })

  it('action is completed but failed return fail message', async () => {
    const event = 'testevent'
    const data: WebhookData = {
      action: 'completed',
      workflow_run: { event, conclusion: 'failure', head_branch: branch },
      repository: { name: repo }
    } as WebhookData

    const result = await evaluateWebhook(data)
    expect(result).toBe(
      `monkaS 👉❌ pipeline in ${repo} on branch ${branch} failed @helltf (${event})`
    )

    const savedStatus = await hb.cache.getString(getWebhookKey(repo, branch))
    expect(savedStatus).toBe(data.workflow_run.conclusion)
  })
})
