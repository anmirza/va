import { Router } from 'express'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db'
import { activityLog } from '../db/schema'
import { verifyToken, isAdmin } from '../middleware/auth'

const router = Router()

// GET /api/activity?limit=10
router.get('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string ?? '10', 10), 100)
    const rows = await db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(limit)
    res.json(rows)
  } catch (err) { next(err) }
})

export default router
