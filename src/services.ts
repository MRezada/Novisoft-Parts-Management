/** Backend integration contract. Replace mock data with these endpoints when ASP.NET Core API is ready. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = {
  parts: `${API_BASE_URL}/parts`,
  inventory: `${API_BASE_URL}/inventory`,
  locations: `${API_BASE_URL}/locations`,
  movements: `${API_BASE_URL}/inventory/transactions`,
  production: `${API_BASE_URL}/production`,
  reports: `${API_BASE_URL}/reports`,
  users: `${API_BASE_URL}/users`,
}
