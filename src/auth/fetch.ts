import { type AuthState } from './types'

/**
 * Error thrown to indicate that at call made to authorizedFetch() could not be
 * completed because we were unable to resolve a valid access token for the logged-in
 * user: if this error is thrown, the user is now logged out and will need to log back
 * in before further authorizedFetch() calls may be made.
 */
export class UnauthorizedFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedFetchError'
  }
}

/**
 * Encapsulates the state required to make HTTP requests (via the fetch API) that are
 * seamlessly authorized with the logged-in user's access token, seamlessly handling
 * token refresh when necessary.
 */
export class AuthorizedFetcher {
  /** Most recent AuthState received from the auth API, if any. */
  currentState = null as AuthState | null

  /** Functions to resume requests that are waiting on AuthState to be initialized. */
  initCallbacks = [] as ((newState: AuthState) => void)[]

  /** Functions to resume requests that are waiting on a refresh to complete. */
  refreshCallbacks = [] as ((newState: AuthState) => void)[]

  /**
   * Callback that initializes an app-wide auth refresh, which will ultimately result in
   * a new AuthState being received and passed to update().
   */
  startRefresh: (refreshToken: string) => void

  /**
   * Initializes app-wide state for authorizedFetch, providing it with a callback that
   * it can use to initiate a refresh.
   */
  constructor(startRefresh: (refreshToken: string) => void) {
    this.startRefresh = startRefresh
  }

  /**
   * Called whenever the auth store changes, letting us know that the app has received a
   * new response from the auth API (which may either be logged in with up-to-date
   * tokens, or logged out).
   */
  update(newState: AuthState) {
    this.currentState = newState

    const callbacks = this.initCallbacks.concat(this.refreshCallbacks)
    this.initCallbacks = []
    this.refreshCallbacks = []
    for (const callback of callbacks) {
      callback(newState)
    }
  }

  /**
   * Makes an HTTP request against a backend API endpoint that requires authorization.
   *
   * If we're logged in with a valid access token, the request will be made with the
   * logged-in user's current access token supplied in the Authorization header. If
   * we're logged out, this function will immediatley throw UnauthorizedFetchError.
   * 
   * If application-wide auth state has not yet been initialized - i.e. we're still
   * validating cached tokens to determine whether they're actually valid - then we
   * don't yet know know whether we're logged in or logged out. In that case, the
   * function will wait until initialization completes, then either make the request or
   * throw UnauthorizedFetchError depending on our initial auth state.
   * 
   * If our first attempt to make a request results in a 401 error, we'll automatically
   * initiate a refresh to get a new access token, then wait for the refresh to
   * complete. If the refresh completes successfully, we'll retry the same request with
   * the new access token. If the refresh fails (i.e. our refresh token isn't accepted
   * and we're logged out as a result), then we'll throw UnauthorizedFetchError.
   *
   * Automatic refreshes are idempotent: if multiple concurrent requests get a 401
   * error, only the first of them will initiate a refresh, and all requests will
   * continue when that refresh finished. Similarly, any request initiated while a
   * refresh is in progress will *not* attempt to make the request, and will instead
   * wait for the refresh to complete.
   * 
   * If a request is retried after refresh and still gets a 401 error (i.e. the auth API
   * completed the refresh and gave us a new token, but that token is still not accepted
   * by the destination API), then we'll return that 401 Response as-is, without
   * attempting another refresh.
   */
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
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
      throw new UnauthorizedFetchError(`Unable to make authorized request to ${input}: not logged in`)
    }

    // We're logged in with a presumably-valid access token, and no refreshes are in
    // progress: initiate the request, and if we hit a 401, initiate a refresh
    console.log(`${input} is being fetched immediately`)
    const accessToken = this.currentState.tokens.accessToken
    return this.handleFetch(true, accessToken, input, init)
  }

  /**
   * Registers a fetch call to be made once the pending auth initialization process
   * completes.
   */
  private fetchUponInit(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.initCallbacks.push((newState) => {
        if (newState.loggedIn) {
          this.handleFetch(true, newState.tokens.accessToken, input, init)
            .then(resolve)
            .catch(reject)
        } else {
          // TODO: Automatically log the user out
          reject(new UnauthorizedFetchError(`Unable to make authorized request to ${input}: not logged in`))
        }
      })
    })
  }

  /**
   * Registers a fetch call to be made once the pending token refresh completes.
   */
  private fetchUponRefresh(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.refreshCallbacks.push((newState) => {
        if (newState.loggedIn) {
          this.handleFetch(false, newState.tokens.accessToken, input, init)
            .then(resolve)
            .catch(reject)
        } else {
          // TODO: Automatically log the user out
          reject(new UnauthorizedFetchError(`Unable to make authorized request to ${input}: token refresh failed`))
        }
      })
    })
  }

  /**
   * Makes the actual fetch call that initiates our desired API request, injected the
   * access token via the Authorization header and optionally initiating a refresh and
   * scheduling a second attempt if required and allowed.
   * 
   * @param allowRefresh whether we can respond to 401 by waiting for a new token and retrying the request
   * @param accessToken Twitch User Access token to supply via 'Authorization: Bearer %s'
   * @param input original URL passed to authorizedFetch by the caller, unmodified
   * @param init original params passed to authorizedFetch by the caller, unmodified
   * @returns eventual response received from the API, on either the first or second attempt
   */
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
        throw new UnauthorizedFetchError("Unable to initiate refresh: not initialized")
      }
      if (!this.currentState.loggedIn) {
        throw new UnauthorizedFetchError("Unable to initiate refresh: not logged in")
      }
      this.startRefresh(this.currentState.tokens.refreshToken)
    }

    console.log(`${input} will be fetched upon refresh`)
    return this.fetchUponRefresh(input, init)
  }
}
