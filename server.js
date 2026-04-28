import express from 'express'
import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_PATH     = resolve(__dirname, 'dist')
const DATA_PATH     = resolve(__dirname, 'data')
const SA_PATH       = resolve(__dirname, 'Hien-AS.service-account.json')
const SETTINGS_PATH = resolve(DATA_PATH, 'settings.json')
const REVENUE_PATH  = resolve(DATA_PATH, 'revenue.json')
const PORT = process.env.PORT || 3000

// Ensure data directory exists
mkdirSync(DATA_PATH, { recursive: true })

// ── Google Auth ────────────────────────────────────────────────────────────────
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

// ── App ────────────────────────────────────────────────────────────────────────
const app = express()
app.use(express.json({ limit: '50mb' }))

// /api/settings
app.get('/api/settings', (req, res) => {
  const defaults = { source: 'file', url: '', interval: 0 }
  try {
    res.json(existsSync(SETTINGS_PATH) ? JSON.parse(readFileSync(SETTINGS_PATH, 'utf-8')) : defaults)
  } catch {
    res.json(defaults)
  }
})

app.post('/api/settings', (req, res) => {
  try {
    writeFileSync(SETTINGS_PATH, JSON.stringify(req.body), 'utf-8')
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// /api/service-account
app.get('/api/service-account', (req, res) => {
  if (!existsSync(SA_PATH)) return res.json({ configured: false })
  try {
    const sa = JSON.parse(readFileSync(SA_PATH, 'utf-8'))
    res.json({ configured: true, email: sa.client_email })
  } catch {
    res.json({ configured: false })
  }
})

app.post('/api/service-account', (req, res) => {
  try {
    const sa = req.body
    if (!sa.client_email || !sa.private_key) throw new Error('JSON thiếu client_email hoặc private_key')
    writeFileSync(SA_PATH, JSON.stringify(sa), 'utf-8')
    tokenCache = { token: null, exp: 0 }
    res.json({ ok: true, email: sa.client_email })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.delete('/api/service-account', (req, res) => {
  try {
    if (existsSync(SA_PATH)) unlinkSync(SA_PATH)
    tokenCache = { token: null, exp: 0 }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// /api/fetch-gdrive
app.get('/api/fetch-gdrive', async (req, res) => {
  const rawUrl = req.query.url
  if (!rawUrl) return res.status(400).send('Missing url')

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
    if (existsSync(SA_PATH)) {
      const sa = JSON.parse(readFileSync(SA_PATH, 'utf-8'))
      const token = await getAccessToken(sa)
      headers['Authorization'] = `Bearer ${token}`
      if (fileId && driveId) {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
      }
    }
    const resp = await fetch(downloadUrl, { redirect: 'follow', headers })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const buf = await resp.arrayBuffer()
    res.set('Content-Type', 'application/octet-stream')
    res.send(Buffer.from(buf))
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

// /api/save-revenue
app.post('/api/save-revenue', (req, res) => {
  try {
    const data = req.body
    writeFileSync(REVENUE_PATH, JSON.stringify(data), 'utf-8')
    res.json({ ok: true, count: data.length })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Serve mutable data files from data/ (takes priority over dist/)
app.get('/revenue.json', (req, res) => {
  const p = REVENUE_PATH
  if (existsSync(p)) return res.sendFile(p)
  // fallback to dist copy on first run
  const fallback = resolve(DIST_PATH, 'revenue.json')
  if (existsSync(fallback)) return res.sendFile(fallback)
  res.json([])
})

app.get('/settings.json', (req, res) => {
  if (existsSync(SETTINGS_PATH)) return res.sendFile(SETTINGS_PATH)
  res.json({ source: 'file', url: '', interval: 0 })
})

// Static files + SPA fallback
app.use(express.static(DIST_PATH))
app.get('*', (req, res) => res.sendFile(resolve(DIST_PATH, 'index.html')))

app.listen(PORT, () => {
  console.log(`HienDashboard running on http://localhost:${PORT}`)
})
