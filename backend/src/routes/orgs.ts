import { Router } from 'express'
import { eq, desc, and } from 'drizzle-orm'
import { body, param, query, validationResult } from 'express-validator'
import { db } from '../db'
import { organisations, activityLog } from '../db/schema'
import { verifyToken, isAdmin, AuthRequest } from '../middleware/auth'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

function handleValidation(req: AuthRequest, res: any): boolean {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  }
  return true
}

// GET /api/orgs?type=agency
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const type = req.query.type as string | undefined
    const rows = type
      ? await db.select().from(organisations).where(eq(organisations.type, type)).orderBy(desc(organisations.createdAt))
      : await db.select().from(organisations).orderBy(desc(organisations.createdAt))
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/orgs/:id
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select().from(organisations).where(eq(organisations.id, String(req.params.id)))
    if (!rows.length) { res.status(404).json({ error: 'Organisation not found' }); return }
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// POST /api/orgs
router.post('/',
  verifyToken,
  isAdmin,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { name, type, country, region, description, category, categoryId, profileData } = req.body
      const [org] = await db.insert(organisations).values({
        id: uuidv4(),
        name,
        type,
        country,
        region,
        description,
        category,
        categoryId,
        profileData,
        status: 'active',
        memberCount: 0,
        createdByAdminId: req.user!.uid,
      }).returning()

      await db.insert(activityLog).values({
        type: 'org_create',
        description: `Created ${type}: ${name}`,
        userId: req.user!.uid,
      })

      res.status(201).json(org)
    } catch (err) {
      next(err)
    }
  }
)

// PATCH /api/orgs/:id
router.patch('/:id',
  verifyToken,
  isAdmin,
  param('id').isUUID(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const allowed = ['name', 'country', 'region', 'description', 'category', 'categoryId', 'profileData', 'status', 'latestUpdateAt', 'lastFollowUpAt']
      const updates: Record<string, unknown> = {}
      for (const key of allowed) {
        if (key in req.body) updates[key] = req.body[key]
      }
      updates.updatedAt = new Date()

      const [updated] = await db.update(organisations)
        .set(updates as any)
        .where(eq(organisations.id, String(req.params.id)))
        .returning()

      if (!updated) { res.status(404).json({ error: 'Organisation not found' }); return }
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /api/orgs/:id  (soft delete — sets status to 'removed')
router.delete('/:id',
  verifyToken,
  isAdmin,
  param('id').isUUID(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const [updated] = await db.update(organisations)
        .set({ status: 'removed', updatedAt: new Date() })
        .where(eq(organisations.id, String(req.params.id)))
        .returning()

      if (!updated) { res.status(404).json({ error: 'Organisation not found' }); return }

      await db.insert(activityLog).values({
        type: 'org_remove',
        description: `Removed org: ${updated.name}`,
        userId: req.user!.uid,
      })

      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }
)

export default router
