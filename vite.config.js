import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { createSign } from 'crypto'

const SA_PATH       = resolve(process.cwd(), 'Hien-AS.service-account.json')
const SETTINGS_PATH = resolve(process.cwd(), 'public/settings.json')
const USERS_PATH    = resolve(process.cwd(), 'public/users.json')

function readUsers() {
  if (!existsSync(USERS_PATH)) return []
  try { return JSON.parse(readFileSync(USERS_PATH, 'utf-8')) } catch { return [] }
}

function writeUsers(users) {
  writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

// In-memory token cache
let tokenCache = { token: null, exp: 0 }

function createJWT(sa) {
  const now = Math.floor(Date.now() / 1000)
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  return `${header}.${payload}.${sign.sign(sa.private_key, 'base64url')}`
}

async function getAccessToken(sa) {
  const now = Date.now() / 1000
  if (tokenCache.token && tokenCache.exp > now + 60) return tokenCache.token
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createJWT(sa),
    }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(data.error_description || data.error || `Token error ${resp.status}`)
  tokenCache = { token: data.access_token, exp: now + (data.expires_in || 3600) }
  return data.access_token
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

function saveRevenuePlugin() {
  return {
    name: 'save-revenue-data',
    configureServer(server) {

      // Settings: GET reads public/settings.json, POST writes it
      server.middlewares.use('/api/settings', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const defaults = { source: 'file', url: '', interval: 0 }

        if (req.method === 'GET') {
          try {
            res.end(existsSync(SETTINGS_PATH) ? readFileSync(SETTINGS_PATH, 'utf-8') : JSON.stringify(defaults))
          } catch { res.end(JSON.stringify(defaults)) }
          return
        }

        if (req.method === 'POST') {
          try {
            const body = await readBody(req)
            JSON.parse(body) // validate JSON
            writeFileSync(SETTINGS_PATH, body, 'utf-8')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        res.statusCode = 405; res.end()
      })

      // Check if service account is configured
      server.middlewares.use('/api/service-account', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'GET') {
          if (!existsSync(SA_PATH)) { res.end(JSON.stringify({ configured: false })); return }
          try {
            const sa = JSON.parse(readFileSync(SA_PATH, 'utf-8'))
            res.end(JSON.stringify({ configured: true, email: sa.client_email }))
          } catch { res.end(JSON.stringify({ configured: false })) }
          return
        }

        if (req.method === 'POST') {
          try {
            const body = await readBody(req)
            const sa = JSON.parse(body)
            if (!sa.client_email || !sa.private_key) throw new Error('JSON thiếu client_email hoặc private_key')
            writeFileSync(SA_PATH, JSON.stringify(sa), 'utf-8')
            tokenCache = { token: null, exp: 0 } // reset token cache
            res.end(JSON.stringify({ ok: true, email: sa.client_email }))
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        if (req.method === 'DELETE') {
          try {
            if (existsSync(SA_PATH)) unlinkSync(SA_PATH)
            tokenCache = { token: null, exp: 0 }
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        res.statusCode = 405; res.end()
      })

      // Proxy Google Drive download (bypass browser CORS, with optional service account auth)
      server.middlewares.use('/api/fetch-gdrive', async (req, res) => {
        if (req.method !== 'GET') { res.statusCode = 405; res.end(); return }
        const rawUrl = new URL(req.url, 'http://localhost').searchParams.get('url')
        if (!rawUrl) { res.statusCode = 400; res.end('Missing url'); return }

        // Convert sharing URL → direct download URL
        const sheetId = rawUrl.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
        const driveId = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
        let downloadUrl = rawUrl
        let fileId = null
        if (sheetId) {
          fileId = sheetId[1]
          downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`
        } else if (driveId) {
          fileId = driveId[1]
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        }

        try {
          const headers = {}

          // Use service account auth if key file exists
          if (existsSync(SA_PATH)) {
            const sa = JSON.parse(readFileSync(SA_PATH, 'utf-8'))
            const token = await getAccessToken(sa)
            headers['Authorization'] = `Bearer ${token}`
            // For Drive API authenticated download
            if (fileId && driveId) {
              downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
            }
          }

          const resp = await fetch(downloadUrl, { redirect: 'follow', headers })
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
          const buf = await resp.arrayBuffer()
          res.setHeader('Content-Type', 'application/octet-stream')
          res.setHeader('Content-Length', buf.byteLength)
          res.end(Buffer.from(buf))
        } catch (e) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: e.message }))
        }
      })

      // POST /api/auth/login
      server.middlewares.use('/api/auth', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        try {
          const { username, password } = JSON.parse(await readBody(req))
          const users = readUsers()
          const user = users.find(u => u.username === username && u.password === password)
          if (!user) {
            res.statusCode = 401
            res.end(JSON.stringify({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' }))
            return
          }
          res.end(JSON.stringify(user))
        } catch (e) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: e.message }))
        }
      })

      // CRUD /api/users
      server.middlewares.use('/api/users', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const urlPath = (req.url || '/').split('?')[0]
        const relativePath = urlPath.replace(/^\/api\/users/, '') || '/'
        const idMatch = relativePath.match(/^\/([^/]+)$/)
        const userId = idMatch ? idMatch[1] : null

        if (req.method === 'GET' && !userId) {
          res.end(JSON.stringify(readUsers()))
          return
        }

        if (req.method === 'POST' && !userId) {
          try {
            const body = JSON.parse(await readBody(req))
            if (!body.username || !body.password || !body.displayName) throw new Error('Thiếu thông tin bắt buộc')
            const users = readUsers()
            if (users.find(u => u.username === body.username)) throw new Error('Tên đăng nhập đã tồn tại')
            const newUser = {
              id: Date.now().toString(),
              username: body.username,
              password: body.password,
              role: body.role || 'viewer',
              isAdmin: body.isAdmin === true,
              displayName: body.displayName,
              createdAt: new Date().toISOString(),
            }
            users.push(newUser)
            writeUsers(users)
            res.end(JSON.stringify(newUser))
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        if (req.method === 'PUT' && userId) {
          try {
            const body = JSON.parse(await readBody(req))
            const users = readUsers()
            const idx = users.findIndex(u => u.id === userId)
            if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Không tìm thấy' })); return }
            if (body.displayName) users[idx].displayName = body.displayName
            if (body.role) users[idx].role = body.role
            if (body.isAdmin !== undefined) users[idx].isAdmin = body.isAdmin === true
            if (body.avatarColor !== undefined) users[idx].avatarColor = body.avatarColor
            if ('avatarImage' in body) users[idx].avatarImage = body.avatarImage
            if (body.password) {
              if (body.oldPassword !== undefined && users[idx].password !== body.oldPassword) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Mật khẩu hiện tại không đúng' }))
                return
              }
              users[idx].password = body.password
            }
            writeUsers(users)
            res.end(JSON.stringify(users[idx]))
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        if (req.method === 'DELETE' && userId) {
          try {
            const users = readUsers()
            const idx = users.findIndex(u => u.id === userId)
            if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Không tìm thấy' })); return }
            users.splice(idx, 1)
            writeUsers(users)
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        res.statusCode = 405; res.end()
      })

      server.middlewares.use('/api/save-revenue', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return }
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
          try {
            const data = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
            writeFileSync(resolve(process.cwd(), 'public/revenue.json'), JSON.stringify(data), 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, count: data.length }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
        })
        req.on('error', () => { res.statusCode = 500; res.end('Stream error') })
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), saveRevenuePlugin()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
