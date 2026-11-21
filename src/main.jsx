import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { getSplash } from './utils/splash'

const root = createRoot(document.getElementById('root'))

// Mounting the whole page is one long main-thread task. Under the splash it
// runs synchronously in the beat where the name sits still at full weight, so
// it can never stall the fill mid-sweep.
const mount = () =>
  flushSync(() => {
    root.render(
      <StrictMode>
        <App />
        <Analytics />
      </StrictMode>,
    )
  })

const splash = getSplash()
if (splash) splash.mount(mount)
else mount()
