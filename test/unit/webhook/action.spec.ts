import {evaluateWebhook, WebhookData} from "@src/webhook/actions"

describe('github action webhook', () => {
  it('action is not completed return undefined', () => {
    const data = { action: 'in_progress' } as WebhookData

    const result = evaluateWebhook(data)

    expect(result).toBeUndefined()
  })
  it('action is completed and successful return undefined', () => {
    const data: WebhookData = {
      action: 'completed',
      workflow_run: { conclusion: 'success' }
    } as WebhookData

    const result = evaluateWebhook(data)

    expect(result).toBeUndefined()
  })
})
