import { fetchJson } from '@/api/client'

export const login = async (username: string, password: string) => {
  return fetchJson<{ id: number; username: string }>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
}

export const logout = async () => {
  return fetchJson<{ detail: string }>('auth/logout', {
    method: 'POST',
  })
}

export const me = async () => {
  return fetchJson<{ id: number; username: string }>('auth/me')
}
