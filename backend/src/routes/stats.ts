import { Router } from 'express'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { organisations, pendingRegistrations, users } from '../db/schema'
import { verifyToken, isAdmin } from '../middleware/auth'

const router = Router()

// GET /api/stats
router.get('/', verifyToken, isAdmin, async (_req, res, next) => {
  try {
    const [agenciesResult, prodResult, pendingResult, usersResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(organisations)
        .where(sql`type = 'agency' AND status = 'active'`),
      db.select({ count: sql<number>`count(*)::int` }).from(organisations)
        .where(sql`type = 'production' AND status = 'active'`),
      db.select({ count: sql<number>`count(*)::int` }).from(pendingRegistrations)
        .where(eq(pendingRegistrations.status, 'pending')),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
    ])

    res.json({
      totalAgencies:    agenciesResult[0]?.count ?? 0,
      totalProduction:  prodResult[0]?.count ?? 0,
      pendingApprovals: pendingResult[0]?.count ?? 0,
      totalUsers:       usersResult[0]?.count ?? 0,
    })
  } catch (err) {
    next(err)
  }
})

export default router
