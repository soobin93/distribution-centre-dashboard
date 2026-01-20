const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

type Paginated<T> = {
  results: T[]
}

const ensureTrailingSlash = (path: string) => {
  const [base, query] = path.split('?')
  const normalised = base.endsWith('/') ? base : `${base}/`
  return query ? `${normalised}?${query}` : normalised
}

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : ''
}

const csrfSafeMethods = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE'])
let csrfTokenCache: string | null = null

export const ensureCsrfToken = async () => {
  if (csrfTokenCache) {
    return csrfTokenCache
  }
  const response = await fetch(`${API_BASE_URL}/${ensureTrailingSlash('auth/csrf')}`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  const payload = (await response.json()) as { csrfToken?: string }
  const token = payload?.csrfToken ?? getCookie('csrftoken')
  if (token) {
    csrfTokenCache = token
  }
  return token
}

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const method = (init?.method ?? 'GET').toUpperCase()
  const headers = new Headers(init?.headers ?? {})
  if (!csrfSafeMethods.has(method) && !headers.has('X-CSRFToken')) {
    const csrfToken = await ensureCsrfToken()
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken)
    }
  }
  const response = await fetch(`${API_BASE_URL}/${ensureTrailingSlash(path)}`, {
    credentials: 'include',
    ...init,
    headers,
  })
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  const text = await response.text()
  if (!text) {
    return undefined as T
  }
  return JSON.parse(text) as T
}

export const unwrapResults = <T>(payload: Paginated<T> | T[]): T[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  return payload.results
}
