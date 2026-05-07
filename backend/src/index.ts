import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import statsRouter        from './routes/stats'
import orgsRouter         from './routes/orgs'
import clientsRouter      from './routes/clients'
import usersRouter        from './routes/users'
import registrationsRouter from './routes/registrations'
import settingsRouter     from './routes/settings'
import activityRouter     from './routes/activity'
import { errorHandler, notFound } from './middleware/error'

const app = express()
const PORT = parseInt(process.env.PORT ?? '4000', 10)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000'

// ── Security + Parsing ────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: [FRONTEND_ORIGIN, 'http://localhost:3001'],
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/stats',         statsRouter)
app.use('/api/orgs',          orgsRouter)
app.use('/api/clients',       clientsRouter)
app.use('/api/users',         usersRouter)
app.use('/api/registrations', registrationsRouter)
app.use('/api/settings',      settingsRouter)
app.use('/api/activity',      activityRouter)

// ── 404 + Error handling ──────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Requisti API running on http://localhost:${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health\n`)
})

export default app
