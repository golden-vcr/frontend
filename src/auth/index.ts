import { writable } from "svelte/store"
import { navigate } from "svelte-routing"

import { config } from "../config"

import { type AuthState } from "./types"
import { restoreAuthState, cacheAuthState, clearAuthState } from "./storage"
import { generateCsrfToken, cacheCsrfToken, validateCsrfToken } from "./csrf"
import { authLogin, authLogout, authRefresh } from "./api"

export { type AuthState } from "./types"

// Initialize a store that will hold our current auth state: any time we get a new
// respones from any of our API's auth endpoints, we'll update auth.state. When the app
// first loads, we'll set an isPending flag to indicate that our auth state isn't
// settled yet: this'll be cleared once our auth initialization logic is finished,
// allowing the user to log in etc. The Twitch login URL needs to be populated with a
// CSRF token etc., so we don't initialize it until we're sure that we no longer need
// any previously-cached CSRF token values.
export const auth = writable({
  state: { loggedIn: false } as AuthState,
  isPending: true,
  loginUrl: '',
})

class AuthorizedFetcher {
  currentState = null as AuthState | null
  initCallbacks = [] as ((newState: AuthState) => void)[]
  refreshCallbacks = [] as ((newState: AuthState) => void)[]

  update(newState: AuthState) {
    this.currentState = newState

    const callbacks = this.initCallbacks.concat(this.refreshCallbacks)
    this.initCallbacks = []
    this.refreshCallbacks = []
    for (const callback of callbacks) {
      callback(newState)
    }
  }

  fetch(input: RequestInfo | URL, init?: RequestInit) {
    // If any requests are currently waiting on a refresh to complete, just add this one
    // to the list - no need to make multiple concurrent requests with an expired access
    // token, and we only want to initiate a single refresh, not one for each 401
    if (this.refreshCallbacks.length > 0) {
      console.log(`${input} will be fetched upon refresh`)
      return this.fetchUponRefresh(input, init)
    }

    // If we don't yet have any AuthState cached, the app is still initializing and
    // determining whether it's logged in - hold off until that initialization finishes
    if (!this.currentState) {
      console.log(`${input} will be fetched upon init`)
      return this.fetchUponInit(input, init)
    }

    // If we're fully initialized and not logged in, we shouldn't be getting the user
    // into situations where they could trigger API calls that require authorization
    if (!this.currentState.loggedIn) {
      throw new Error(`Unable to make authorized request to ${input}: not logged in`)
    }

    // We're logged in with a presumably-valid access token, and no refreshes are in
    // progress: initiate the request, and if we hit a 401, initiate a refresh
    console.log(`${input} is being fetched immediately`)
    const accessToken = this.currentState.tokens.accessToken
    return this.handleFetch(true, accessToken, input, init)
  }

  private fetchUponInit(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.initCallbacks.push((newState) => {
        if (newState.loggedIn) {
          this.handleFetch(true, newState.tokens.accessToken, input, init)
            .then(resolve)
            .catch(reject)
        } else {
          // TODO: Automatically log the user out
          reject(new Error(`Unable to make authorized request to ${input}: not logged in`))
        }
      })
    })
  }

  private fetchUponRefresh(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.refreshCallbacks.push((newState) => {
        if (newState.loggedIn) {
          this.handleFetch(false, newState.tokens.accessToken, input, init)
            .then(resolve)
            .catch(reject)
        } else {
          // TODO: Automatically log the user out
          reject(new Error(`Unable to make authorized request to ${input}: token refresh failed`))
        }
      })
    })
  }

  private async handleFetch(allowRefresh: boolean, accessToken: string, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Inject the access token into the request, as the value for the Authorization
    // header
    const headerValue = `Bearer ${accessToken}`
    if (!init) {
      init = {}
    }
    if (init.headers) {
      if (init.headers instanceof Headers) {
        init.headers.set("authorization", headerValue)
      } else if (Array.isArray(init.headers)) {
        init.headers.push(["authorization", headerValue])
      } else {
        init.headers["authorization"] = headerValue
      }
    } else {
      init.headers = { authorization: headerValue }
    }

    // Make the request, and return the response directly unless we get a 401 error and
    // we're permitted to refresh
    const r = await fetch(input, init)
    console.log(`${input} got ${r.status}`)
    if (!allowRefresh || r.status !== 401) {
      return r
    }

    // We got a 401 and we want to refresh: if there's not currently a refresh in
    // progress, we want to initiate one
    if (this.refreshCallbacks.length === 0) {
      console.log(`${input} is initiating refresh`)
      if (!this.currentState) {
        throw new Error("Unable to initiate refresh: not initialized")
      }
      if (!this.currentState.loggedIn) {
        throw new Error("Unable to initiate refresh: not logged in")
      }
      const refreshToken = this.currentState.tokens.refreshToken
      authRefresh(refreshToken).then((newState) => {
        cacheAuthState(newState)
        auth.update((prev) => ({
          ...prev,
          state: newState,
          isPending: false,
        }))
      })
    }

    console.log(`${input} will be fetched upon refresh`)
    return this.fetchUponRefresh(input, init)
  }
}

const authorizedFetcher = new AuthorizedFetcher()
auth.subscribe((v) => {
  if (!v.isPending) {
    authorizedFetcher.update(v.state)
  }
})

export function authorizedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return authorizedFetcher.fetch(input, init)
}

// From here, we proceed with our auth initialization routine, which branches to one of
// three paths depending on the initial URL that the app has been loaded with
switch (window.location.pathname) {
case config.twitch.redirectPath:
  // If our initial page load is /auth, we're being redirected back to the app after
  // completing the Twitch authorization code grant flow
  initForAuthRedirect()
  break
case config.twitch.logoutPath:
  // If our initial page load is /logout, we want to invalidate any existing auth
  // tokens, purge all stored auth state, and reset everything to a logged-out state
  initForLogout()
  break
default:
  // For any other page load, we want to proceed with normal auth initialization: load
  // up and validate any cached auth state if present; remain logged out otherwise
  initForPageLoad()
  break
}

function initForPageLoad() {
  // If this is an ordinary page load, we want to generate a new CSRF token to include
  // in our Twitch login URL, and cache it to localStorage so we can validate it once
  // we're redirected back from Twitch...
  const loginUrl = prepareLoginUrlWithCachedCrsfToken()

  // ...then load any previously-cached auth details from localStorage.
  const initialState = restoreAuthState()

  if (!initialState.loggedIn) {
    // If we don't have a valid login session to restore, our initialization is done: we
    // can set the login URL so that when the user chooses to log in, they'll be sent to
    // Twitch to grant our app access, then they'll be redirected back here
    auth.update((prev) => ({
      ...prev,
      isPending: false,
      loginUrl,
    }))
    return
  }
  // Otherwise, we have cached details indicating that we were logged in as of the last
  // page load. We'll need to validate our Twitch tokens before we can trust that we're
  // actually logged in, but we'll go ahead and render the page as if we're logged in...
  auth.update((prev) => ({
    ...prev,
    state: initialState,
    loginUrl,
  }))

  // ...before using our refresh token to obtain a new access token. Once the refresh
  // completes successfully, we'll know that we have valid, up-to-date user details. If
  // the refresh fails, we can clear cached auth state and return the app to a
  // logged-out state.
  authRefresh(initialState.tokens.refreshToken).then((newState) => {
    cacheAuthState(newState)
    auth.update((prev) => ({
      ...prev,
      state: newState,
      isPending: false,
    }))
  })
}

function initForAuthRedirect() {
  // If we're being redirected back to the app (at /auth) after completing a Twitch
  // authorization code grant flow, we want to complete the login by validating the data
  // sent by Twitch, then make a call to our own server's /login endpoint, which will
  // exchange the provided authorization code for a Twitch user access token, completing
  // the login and providing us with valid user details and tokens. If that process
  // fails at any point, we want to resolve a logged-out result, signal the error to the
  // user, and boot them back to the root route.
  const bounceToRoot = (error: string) => {
    auth.set({
      state: { loggedIn: false, error },
      isPending: false,
      loginUrl: prepareLoginUrlWithCachedCrsfToken(),
    })
    navigate('/', { replace: true })
  }

  // If the user clicked 'Cancel' to deny access on the Twitch OAuth consent screen, we
  // should have an '?error=access_denied' param: if so, early-out by aborting the login
  // without an error
  const params = new URLSearchParams(window.location.search)
  if (params.get('error') === 'access_denied') {
    bounceToRoot('')
    return
  }
  
  // Now examine the URL to parse the parameters provided by Twitch, retrieving our
  // authorization code...
  const code = params.get('code') || ''
  if (!code) {
    bounceToRoot("Authorization failed: 'code' URL parameter is required")
    return 
  }

  // ...verify that we're being given access with all required scopes...
  const scopesString = params.get('scope') || ''
  const scopes = scopesString.split(' ')
  const missingScopes = config.twitch.scopes.filter((s) => !scopes.includes(s))
  if (missingScopes.length > 0) {
    bounceToRoot(`Authorization failed: required scopes were not granted (${missingScopes.join(', ')})`)
    return
  }

  // ...and check the provided 'state' value to ensure that it matches the CSRF token we
  // sent in the initial login URL.
  const csrfToken = params.get('state') || ''
  if (!validateCsrfToken(csrfToken)) {
    bounceToRoot("Authorization failed: CSRF token could not be verified from 'state' parameter")
    return
  }

  // We now have a trusted authorization code that meets our needs, so have our auth
  // server exchange it for an access token to finish logging us in
  authLogin(code).then((newState) => {
    cacheAuthState(newState)
    auth.update((prev) => ({
      ...prev,
      state: newState,
      isPending: false,
      loginUrl: prepareLoginUrlWithCachedCrsfToken(),
    }))
    navigate('/', { replace: true })
  })
}

function initForLogout() {
  const initialState = restoreAuthState()
  if (initialState.loggedIn) {
    authLogout(initialState.tokens.accessToken).then((newState) => {
      auth.update((prev) => ({
        ...prev,
        state: newState,
        isPending: false,
        loginUrl: prepareLoginUrlWithCachedCrsfToken(),
      }))
    })
    clearAuthState()
    navigate('/', { replace: true })
  }
}

function prepareLoginUrlWithCachedCrsfToken(): string {
  const csrfToken = generateCsrfToken()
  cacheCsrfToken(csrfToken)

  const url = new URL('https://id.twitch.tv/oauth2/authorize')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.twitch.clientId)
  url.searchParams.set('redirect_uri', window.location.origin + config.twitch.redirectPath)
  url.searchParams.set('scope', config.twitch.scopes.join(' '))
  url.searchParams.set('state', csrfToken)
  return url.toString()
}
