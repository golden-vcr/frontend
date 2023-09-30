const KEY_CSRF_TOKEN = 'gvcr.csrf.token'

export function generateCsrfToken(): string {
  const a = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  const b = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  const c = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  const d = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  const value = `${a}${b}${c}${d}`
  return value
}

export function cacheCsrfToken(csrfToken: string) {
  localStorage.setItem(KEY_CSRF_TOKEN, csrfToken)
}

export function validateCsrfToken(csrfToken: string): boolean {
  const cachedCsrfToken = localStorage.getItem(KEY_CSRF_TOKEN) || ''
  return !!csrfToken && csrfToken === cachedCsrfToken
}
