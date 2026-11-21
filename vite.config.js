/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleChat, sendChatResult } from './server/chatHandler.js'
import { handleContact } from './server/contactHandler.js'
import { clientIdFrom, readJsonBody, sendJson } from './server/http.js'

// Serves /api/chat and /api/contact during `npm run dev`, mirroring the
// serverless functions in api/. Keys come from .env on the server side only
// (no VITE_ prefix, so they are never bundled into client code).
function devApi(env) {
  const route = (handle, respond) => async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      return res.end()
    }
    try {
      const result = await handle(await readJsonBody(req), clientIdFrom(req))
      await respond(result, res)
    } catch (err) {
      console.error(err)
      if (!res.headersSent) res.statusCode = 500
      res.end()
    }
  }

  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(
        '/api/chat',
        route((body, clientId) => handleChat(body, env.GROQ_API_KEY, clientId), sendChatResult),
      )
      server.middlewares.use(
        '/api/contact',
        route(
          (body, clientId) =>
            handleContact(body, { apiKey: env.RESEND_API_KEY, from: env.CONTACT_FROM, clientId }),
          sendJson,
        ),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), devApi(env)],
  }
})
