const AUTH_KEY  = 'aw_user'
const USERS_KEY = 'aw_users'

function hashPass(pass) {
  let h = 5381
  for (let i = 0; i < pass.length; i++) h = ((h << 5) + h) + pass.charCodeAt(i)
  return (h >>> 0).toString(16)
}

export function getUsers()       { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
export function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }
export function getCurrentUser() { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null') }
export function setCurrentUser(u){ localStorage.setItem(AUTH_KEY, JSON.stringify(u)) }
export function clearCurrentUser(){ localStorage.removeItem(AUTH_KEY) }

export function authRegister(username, email, password) {
  if (!username || !email || !password) return { ok: false, msg: 'All fields are required.' }
  if (username.length < 3) return { ok: false, msg: 'Username must be at least 3 characters.' }
  if (password.length < 6) return { ok: false, msg: 'Password must be at least 6 characters.' }
  if (!/\S+@\S+\.\S+/.test(email)) return { ok: false, msg: 'Please enter a valid email.' }

  const users = getUsers()
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
    return { ok: false, msg: 'That username is already taken.' }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, msg: 'That email is already registered.' }

  const user = {
    id: Date.now(), username, email,
    password: hashPass(password),
    bio: '', location: '', machines: [],
    joinDate: new Date().toISOString(),
    role: users.length === 0 ? 'admin' : 'member',
    posts: 0, uploads: 0,
  }
  users.push(user)
  saveUsers(users)
  const { password: _, ...safe } = user
  setCurrentUser(safe)
  return { ok: true, user: safe }
}

export function authLogin(usernameOrEmail, password) {
  if (!usernameOrEmail || !password) return { ok: false, msg: 'All fields are required.' }
  const users = getUsers()
  const user  = users.find(u =>
    u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
    u.email.toLowerCase()    === usernameOrEmail.toLowerCase()
  )
  if (!user) return { ok: false, msg: 'No account found with that username or email.' }
  if (user.password !== hashPass(password)) return { ok: false, msg: 'Incorrect password.' }
  const { password: _, ...safe } = user
  setCurrentUser(safe)
  return { ok: true, user: safe }
}

export function authIncrementStat(userId, stat) {
  const users = getUsers()
  const u     = users.find(u => u.id === userId)
  if (!u) return
  u[stat] = (u[stat] || 0) + 1
  saveUsers(users)
  const current = getCurrentUser()
  if (current?.id === userId) {
    const { password: _, ...safe } = u
    setCurrentUser(safe)
    return safe
  }
}
