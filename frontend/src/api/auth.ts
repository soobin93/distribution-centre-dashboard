import { fetchJson } from '@/api/client'

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : ''
}

export const ensureCsrfToken = async () => {
  await fetchJson<{ csrfToken: string }>('auth/csrf')
  return getCookie('csrftoken')
}

export const login = async (username: string, password: string) => {
  const csrfToken = await ensureCsrfToken()
  return fetchJson<{ id: number; username: string }>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ username, password }),
  })
}

export const logout = async () => {
  const csrfToken = getCookie('csrftoken')
  return fetchJson<{ detail: string }>('auth/logout', {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })
}

export const me = async () => {
  return fetchJson<{ id: number; username: string }>('auth/me')
}
