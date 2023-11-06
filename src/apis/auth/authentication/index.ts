// https://golden-vcr.github.io/auth/#/authentication
import { config } from '../../../config'
import type { AuthState } from './types'
import { parseAuthState } from './parse'

export * from './types'

// https://golden-vcr.github.io/auth/#/authentication/postLogin
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

// https://golden-vcr.github.io/auth/#/authentication/postRefresh
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

// https://golden-vcr.github.io/auth/#/authentication/postLogout
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
