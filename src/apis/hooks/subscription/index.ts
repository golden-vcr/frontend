import { authorizedFetch } from '../../../auth'

import type { SubscriptionStatus } from './types'
import { parseSubscriptionStatus } from './parse'

export * from './types'

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const url = '/api/hooks/subscriptions'
  const r = await authorizedFetch(url)
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
  const data = await r.json()
  return parseSubscriptionStatus(data)
}

export async function createMissingSubscriptions(): Promise<void> {
  const url = '/api/hooks/subscriptions'
  const r = await authorizedFetch(url, { method: 'PATCH' })
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
}

export async function deleteAllSubscriptions(): Promise<void> {
  const url = '/api/hooks/subscriptions'
  const r = await authorizedFetch(url, { method: 'DELETE' })
  if (!r.ok) {
    let suffix = ''
    try {
      const message = await r.text()
      suffix = `: ${message}`
    } catch (ignored) {
    }
    throw new Error(`Got ${r.status} response from ${url}${suffix}`)
  }
}
