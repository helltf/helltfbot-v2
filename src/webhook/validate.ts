import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

const createComparisonSignature = (body: any): string => {
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
  const self_signature = hmac.update(JSON.stringify(body)).digest('hex')

  return `sha256=${self_signature}`
}

const compareSignatures = (signature: string, comparison_signature: string) => {
  const source = Buffer.from(signature)
  const comparison = Buffer.from(comparison_signature)

  return crypto.timingSafeEqual(source, comparison)
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-hub-signature-256']

  if (!signature) {
    return res.status(500).send('Signature required')
  }

  const comparisonSignature = createComparisonSignature(req.body)

  if (!compareSignatures(signature as string, comparisonSignature)) {
    return res.status(500).send('Mismatched signatures')
  }

  next()
}

export const validateMethods = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const method = req.method

  if (method !== 'POST') {
    return res.status(405).send('Invalid http method')
  }

  next()
}
