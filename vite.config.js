/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { clientIdFrom, handleChat, sendChatResult } from './server/chatHandler.js'

// Serves /api/chat during `npm run dev`, reading GROQ_API_KEY from .env on the
// server side only (no VITE_ prefix, so it is never bundled into client code).
function chatApi(apiKey) {
  return {
    name: 'chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end()
        }
        try {
          let raw = ''
          for await (const chunk of req) {
            raw += chunk
            if (raw.length > 32_000) throw new Error('Request too large')
          }
          const result = await handleChat(JSON.parse(raw || '{}'), apiKey, clientIdFrom(req))
          await sendChatResult(result, res)
        } catch (err) {
          console.error(err)
          if (!res.headersSent) res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), chatApi(env.GROQ_API_KEY)],
  }
})
