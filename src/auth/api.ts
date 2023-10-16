import { config } from '../config'
import { type AuthRole, type AuthState, type UserDetails, type UserTokens } from './types'

export async function initiateLogin(code: string): Promise<AuthState> {
  const url = new URL('/api/auth/login', window.location.origin)
  url.searchParams.set('code', code)
  url.searchParams.set('redirect_uri', window.location.origin + config.twitch.redirectPath)

  const r = await fetch(url, { method: 'POST' })
  if (!r.ok && r.status !== 401) {
    throw new Error(`Login request failed with status code ${r.status}`)
  }

  const data = await r.json()
  const state = parseAuthState(data)
  if (state.loggedIn !== r.ok) {
    throw new Error(`Unexpected auth state: response with status ${r.status} should not indicate loggedIn:${state.loggedIn}`)
  }
  return state
}

export async function initiateRefresh(refreshToken: string): Promise<AuthState> {
  const init = {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  }
  const r = await fetch('/api/auth/refresh', init)
  if (!r.ok && r.status !== 401) {
    throw new Error(`Auth refresh request failed with status code ${r.status}`)
  }

  const data = await r.json()
  const state = parseAuthState(data)
  if (state.loggedIn !== r.ok) {
    throw new Error(`Unexpected auth state: response with status ${r.status} should not indicate loggedIn:${state.loggedIn}`)
  }
  return state
}

export async function initiateLogout(accessToken: string): Promise<AuthState> {
  const init = {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  }
  const r = await fetch('/api/auth/logout', init)
  if (!r.ok && r.status !== 401) {
    throw new Error(`Logout request failed with status code ${r.status}`)
  }

  const data = await r.json()
  const state = parseAuthState(data)
  if (state.loggedIn) {
    throw new Error(`Unexpected auth state: logout response should not indicate loggedIn:${state.loggedIn}`)
  }
  return state
}

function parseAuthState(data: unknown): AuthState {
  if (typeof data !== "object") {
    throw new Error("invalid auth state: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // AuthState.loggedIn
  if (typeof obj["loggedIn"] !== "boolean") {
    throw new Error("invalid auth state: boolean 'loggedIn' field is required")
  }
  const loggedIn = obj["loggedIn"]

  // Parse remaining fields based on login state
  if (loggedIn) {
    // AuthState.role
    if (typeof obj["role"] !== "string" || !obj["role"]) {
      throw new Error("invalid auth state: non-empty 'role' field is required")
    }
    const role = obj["role"] as AuthRole
    if (role !== "viewer" && role !== "broadcaster") {
      throw new Error(`invalid auth state: role '${role}' is not recognized`)
    }

    // AuthState.profileImageUrl
    let profileImageUrl = ""
    if (typeof obj["profileImageUrl"] === "string" && obj["profileImageUrl"]) {
      profileImageUrl = obj["profileImageUrl"]
    }

    // AuthState.user
    const user = parseUserDetails(obj["user"])

    // AuthState.tokens
    const tokens = parseUserTokens(obj["tokens"])

    return { loggedIn, role, profileImageUrl, user, tokens }
  }
  // AuthState.error
  const error = (typeof obj["error"] === "string") ? obj["error"] : ""
  return { loggedIn, error }
}

function parseUserDetails(data: unknown): UserDetails {
  if (typeof data !== "object") {
    throw new Error("invalid user details: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // UserDetails.id
  if (typeof obj["id"] !== "string" || !obj["id"]) {
    throw new Error("invalid user details: non-empty 'id' field is required")
  }
  const id = obj["id"]

  // UserDetails.login
  if (typeof obj["login"] !== "string" || !obj["login"]) {
    throw new Error("invalid user details: non-empty 'login' field is required")
  }
  const login = obj["login"]
  
  // UserDetails.displayName
  if (typeof obj["displayName"] !== "string" || !obj["displayName"]) {
    throw new Error("invalid user details: non-empty 'displayName' field is required")
  }
  const displayName = obj["displayName"]

  return { id, login, displayName }
}

function parseUserTokens(data: unknown): UserTokens {
  if (typeof data !== "object") {
    throw new Error("invalid user tokens: data is not an object")
  }
  const obj = data as { [key: string]: unknown }

  // UserTokens.accessToken
  if (typeof obj["accessToken"] !== "string" || !obj["accessToken"]) {
    throw new Error("invalid user tokens: non-empty 'accessToken' field is required")
  }
  const accessToken = obj["accessToken"]

  // UserTokens.refreshToken
  if (typeof obj["refreshToken"] !== "string" || !obj["refreshToken"]) {
    throw new Error("invalid user tokens: non-empty 'refreshToken' field is required")
  }
  const refreshToken = obj["refreshToken"]

  // UserTokens.scopes
  const scopes = [] as string[]
  if (!Array.isArray(obj["scopes"])) {
    throw new Error("invalid user tokens: 'scopes' array is required")
  }
  for (const scope of obj["scopes"]) {
    if (typeof scope !== "string" || !scope) {
      throw new Error("invalid user tokens: all items in 'scopes' array must be non-empty strings")
    }
    scopes.push(scope)
  }

  return { accessToken, refreshToken, scopes }
}
