import { config } from "../config"

import { type AuthState, type AuthRole } from "./types"

const TWITCH_AUTH_STORAGE_KEY_PREFIX = 'gvcr.twitch.'
const TWITCH_AUTH_KEY = (name: string) => `${TWITCH_AUTH_STORAGE_KEY_PREFIX}${name}`

const GVCR_AUTH_STORAGE_KEY_PREFIX = 'gvcr.auth.'
const GVCR_AUTH_KEY = (name: string) => `${GVCR_AUTH_STORAGE_KEY_PREFIX}${name}`

const KEY_TWITCH_CLIENT_ID = TWITCH_AUTH_KEY('clientId')
const KEY_TWITCH_USER_ID = TWITCH_AUTH_KEY('userId')
const KEY_TWITCH_USER_LOGIN = TWITCH_AUTH_KEY('userLogin')
const KEY_TWITCH_USER_DISPLAY_NAME = TWITCH_AUTH_KEY('userDisplayName')
const KEY_TWITCH_ACCESS_TOKEN = TWITCH_AUTH_KEY('accessToken')
const KEY_TWITCH_REFRESH_TOKEN = TWITCH_AUTH_KEY('refreshToken')
const KEY_TWITCH_SCOPES = TWITCH_AUTH_KEY('scopes')
const KEY_GVCR_ROLE = GVCR_AUTH_KEY('role')

export function cacheAuthState(state: AuthState) {
  if (state.loggedIn) {
    // Store the static Twitch client ID for our app, so that if our client ID ever
    // changes it'll invalidate previously-stored tokens
    localStorage.setItem(KEY_TWITCH_CLIENT_ID, config.twitch.clientId)

    // Store the user details and tokens associated with our current login
    localStorage.setItem(KEY_TWITCH_USER_ID, state.user.id)
    localStorage.setItem(KEY_TWITCH_USER_LOGIN, state.user.login)
    localStorage.setItem(KEY_TWITCH_USER_DISPLAY_NAME, state.user.displayName)
    localStorage.setItem(KEY_TWITCH_ACCESS_TOKEN, state.tokens.accessToken)
    localStorage.setItem(KEY_TWITCH_REFRESH_TOKEN, state.tokens.refreshToken)
    localStorage.setItem(KEY_TWITCH_SCOPES, state.tokens.scopes.join(' '))

    // Store the Golden VCR role that we've recorded for this user
    localStorage.setItem(KEY_GVCR_ROLE, state.role)
  } else {
    // If we aren't logged in, zealously clear all auth-related state
    clearAuthState()
  }
}

export function restoreAuthState(): AuthState {
  // Prepare to clear auth state if we don't have entirely well-formed state in storage
  const logout = () => { clearAuthState(); return { loggedIn: false } as AuthState }

  // If we previously cached keys to localStorage with a different Twitch client ID than
  // we have now, clear storage and abort
  const clientId = localStorage.getItem(KEY_TWITCH_CLIENT_ID) || ''
  if (clientId !== config.twitch.clientId) {
    return logout()
  }

  // Only continue if we have all required values stored, otherwise clear
  const role = localStorage.getItem(KEY_GVCR_ROLE) || ''
  const userId = localStorage.getItem(KEY_TWITCH_USER_ID) || ''
  const userLogin = localStorage.getItem(KEY_TWITCH_USER_LOGIN) || ''
  const userDisplayName = localStorage.getItem(KEY_TWITCH_USER_DISPLAY_NAME) || ''
  const accessToken = localStorage.getItem(KEY_TWITCH_ACCESS_TOKEN) || ''
  const refreshToken = localStorage.getItem(KEY_TWITCH_REFRESH_TOKEN) || ''
  const scopesString = localStorage.getItem(KEY_TWITCH_SCOPES) || ''
  if (!userId || !userLogin || !userDisplayName || !accessToken || !refreshToken || !scopesString) {
    return logout()
  }

  // If we previously cached a token that does not have all required scopes, abandon
  // that token and remain logged out
  const scopes = scopesString.split(' ')
  const hasAllRequiredScopes = config.twitch.scopes.every((s) => scopes.includes(s))
  if (!hasAllRequiredScopes) {
    return logout()
  }

  // We've restored tokens and user details from localStorage, so we can presume that
  // we're logged in (note that it's not guaranteed that our tokens are valid)
  return {
    loggedIn: true,
    role: role as AuthRole,
    user: {
      id: userId,
      login: userLogin,
      displayName: userDisplayName,
    },
    tokens: {
      accessToken,
      refreshToken,
      scopes,
    },
  }
}

export function clearAuthState() {
  // Collect the name of every 'gvcr.twitch.'-prefixed key that has a value set
  const toRemove = [] as string[]
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    if (key.startsWith(TWITCH_AUTH_STORAGE_KEY_PREFIX) || key.startsWith(GVCR_AUTH_STORAGE_KEY_PREFIX)) {
      toRemove.push(key)
    }
  }

  // Eject all such values from localStorage
  for (const key of toRemove) {
    localStorage.removeItem(key)
  }
}
