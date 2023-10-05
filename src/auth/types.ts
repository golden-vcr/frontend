export type AuthRole = 'viewer' | 'broadcaster'

export type AuthState = {
  loggedIn: true
  role: AuthRole
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
