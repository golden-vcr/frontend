import type { SubscriptionStatus, SubscriptionState } from './types'

export function parseSubscriptionStatus(data: unknown): SubscriptionStatus {
  if (typeof data !== "object") {
    throw new Error("invalid subscription status: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // SubscriptionStatus.ok
  if (typeof obj["ok"] !== "boolean") {
    throw new Error("invalid subscription status: boolean 'ok' field is required")
  }
  const ok = obj["ok"]

  // SubscriptionStatus.subscriptions
  const subscriptions = [] as SubscriptionState[]
  if (!Array.isArray(obj["subscriptions"])) {
    throw new Error("invalid subscription status: 'subscriptions' array is required")
  }
  for (let i = 0; i < obj["subscriptions"].length; i++) {
    subscriptions.push(parseSubscriptionState(obj["subscriptions"][i]))
  }

  return { ok, subscriptions }
}

export function parseSubscriptionState(data: unknown): SubscriptionState {
  if (typeof data !== "object") {
    throw new Error("invalid subscription state: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // SubscriptionState.required
  if (typeof obj["required"] !== "boolean") {
    throw new Error("invalid subscription state: boolean 'required' field is required")
  }
  const required = obj["required"]

  // SubscriptionState.type
  if (typeof obj["type"] !== "string" || obj["type"] === "") {
    throw new Error("invalid subscription state: non-empty 'type' field is required")
  }
  const type = obj["type"]

  // SubscriptionState.version
  if (typeof obj["version"] !== "string" || obj["version"] === "") {
    throw new Error("invalid subscription state: non-empty 'version' field is required")
  }
  const version = obj["version"]

  // SubscriptionState.condition
  let condition = {} as { [key: string]: string }
  if (!obj["condition"] || typeof obj["condition"] !== "object") {
    throw new Error("invalid subscription state: 'condition' object field is required")
  }
  for (const [k, v] of Object.entries(obj["condition"])) {
    if (typeof v !== "string") {
      throw new Error("invalid subscription state: 'condition' object must contain only string values")
    }
    condition[k] = v
  }

  // SubscriptionState.version
  if (typeof obj["status"] !== "string" || obj["status"] === "") {
    throw new Error("invalid subscription state: non-empty 'status' field is required")
  }
  const status = obj["status"]

  return { required, type, version, condition, status }
}
