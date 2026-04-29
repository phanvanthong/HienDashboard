import { ref } from 'vue'

const SESSION_KEY = 'hien_auth'

export const currentUser = ref(
  JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
)

export function setUser(user) {
  currentUser.value = user
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearUser() {
  currentUser.value = null
  localStorage.removeItem(SESSION_KEY)
}

export async function apiLogin(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại')
  setUser(data)
  return data
}
