import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

function saveRevenuePlugin() {
  return {
    name: 'save-revenue-data',
    configureServer(server) {
      server.middlewares.use('/api/save-revenue', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf-8')
            const data = JSON.parse(body)
            // Ghi vào public/ — Vite serve file tĩnh trực tiếp từ disk, không cache module
            const filePath = resolve(process.cwd(), 'public/revenue.json')
            writeFileSync(filePath, JSON.stringify(data), 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, count: data.length }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
        })
        req.on('error', () => {
          res.statusCode = 500
          res.end('Stream error')
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), saveRevenuePlugin()],
})
