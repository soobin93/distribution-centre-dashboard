const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

type Paginated<T> = {
  results: T[]
}

const ensureTrailingSlash = (path: string) => {
  const [base, query] = path.split('?')
  const normalised = base.endsWith('/') ? base : `${base}/`
  return query ? `${normalised}?${query}` : normalised
}

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/${ensureTrailingSlash(path)}`, init)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const unwrapResults = <T>(payload: Paginated<T> | T[]): T[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  return payload.results
}
