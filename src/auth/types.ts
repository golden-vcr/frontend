export type AuthState = {
  loggedIn: true
  user: UserDetails
  tokens: UserTokens
} | {
  loggedIn: false
  error?: string
}

export type UserDetails = {
  id: string
  login: string
  displayName: string
}

export type UserTokens = {
  accessToken: string
  refreshToken: string
  scopes: string[]
}
