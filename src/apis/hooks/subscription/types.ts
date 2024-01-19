export type SubscriptionStatus = {
  ok: boolean
  subscriptions: SubscriptionState[]
}

export type SubscriptionState = {
  required: boolean
  type: string
  version: string
  condition: { [key: string]: string }
  status: string
}
