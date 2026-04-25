import { Router } from 'express'
import { eq, asc } from 'drizzle-orm'
import { body, validationResult } from 'express-validator'
import { db } from '../db'
import { vaCategories, rfiFields, config } from '../db/schema'
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

// ── Categories ────────────────────────────────────────────────────────────────

// GET /api/settings/categories
router.get('/categories', verifyToken, async (_req, res, next) => {
  try {
    const rows = await db.select().from(vaCategories).orderBy(asc(vaCategories.orderIndex))
    res.json(rows)
  } catch (err) { next(err) }
})

// POST /api/settings/categories  — create or update a category
router.post('/categories',
  verifyToken,
  isAdmin,
  body('name').trim().notEmpty().withMessage('Category name is required'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { id, name, iconSvg, orderIndex } = req.body
      const catId = id ?? `cat-${uuidv4()}`

      const existing = await db.select().from(vaCategories).where(eq(vaCategories.id, catId))
      let result
      if (existing.length) {
        const [updated] = await db.update(vaCategories)
          .set({ name, iconSvg, orderIndex })
          .where(eq(vaCategories.id, catId))
          .returning()
        result = updated
      } else {
        const [inserted] = await db.insert(vaCategories)
          .values({ id: catId, name, iconSvg: iconSvg ?? '', orderIndex: orderIndex ?? 0 })
          .returning()
        result = inserted
      }

      res.json(result)
    } catch (err) { next(err) }
  }
)

// DELETE /api/settings/categories/:id
router.delete('/categories/:id', verifyToken, isAdmin, async (req: AuthRequest, res, next) => {
  try {
    await db.delete(vaCategories).where(eq(vaCategories.id, String(req.params.id)))
    res.json({ success: true })
  } catch (err) { next(err) }
})

// ── RFI Fields ────────────────────────────────────────────────────────────────

// GET /api/settings/rfi/:categoryId
router.get('/rfi/:categoryId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select().from(rfiFields)
      .where(eq(rfiFields.categoryId, String(req.params.categoryId)))
      .orderBy(asc(rfiFields.orderIndex))
    res.json(rows)
  } catch (err) { next(err) }
})

// PUT /api/settings/rfi/:categoryId  — replace all fields for a category
router.put('/rfi/:categoryId',
  verifyToken,
  isAdmin,
  body('fields').isArray().withMessage('Fields must be an array'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const categoryId = String(req.params.categoryId)
      const fields = req.body.fields as Array<{
        id?: string; label: string; type: string; required: boolean; section?: string; orderIndex?: number; visible?: boolean
      }>

      // Delete existing fields for this category
      await db.delete(rfiFields).where(eq(rfiFields.categoryId, String(categoryId)))

      if (fields.length > 0) {
        await db.insert(rfiFields).values(
          fields.map((f, i) => ({
            id: f.id ?? uuidv4(),
            categoryId,
            label: f.label,
            type: f.type,
            required: f.required ?? false,
            section: f.section,
            orderIndex: f.orderIndex ?? i,
            visible: f.visible ?? true,
          }))
        )
      }

      const saved = await db.select().from(rfiFields)
        .where(eq(rfiFields.categoryId, String(categoryId)))
        .orderBy(asc(rfiFields.orderIndex))
      res.json(saved)
    } catch (err) { next(err) }
  }
)

// ── Disclaimers ───────────────────────────────────────────────────────────────

const DEFAULT_DISCLAIMER = {
  agency: `Welcome to the VA Consulting agency registration portal.\n\nBefore proceeding with your registration, please read the following legal disclaimer carefully.\n\nBy submitting your agency profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.\n\nYour submission will be reviewed by our team before your agency appears in the directory. This process typically takes 2–5 business days.`,
  production: `Welcome to the VA Consulting production company registration portal.\n\nBefore proceeding with your registration, please read the following legal disclaimer carefully.\n\nBy submitting your production company profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.\n\nYour submission will be reviewed by our team before your production company appears in the directory. This process typically takes 2–5 business days.`,
}

// GET /api/settings/disclaimers
router.get('/disclaimers', verifyToken, async (_req, res, next) => {
  try {
    const rows = await db.select().from(config).where(eq(config.key, 'disclaimers'))
    if (rows.length) {
      res.json(rows[0].value)
    } else {
      res.json(DEFAULT_DISCLAIMER)
    }
  } catch (err) { next(err) }
})

// PUT /api/settings/disclaimers
router.put('/disclaimers',
  verifyToken,
  isAdmin,
  body('agency').optional().isString(),
  body('production').optional().isString(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const existing = await db.select().from(config).where(eq(config.key, 'disclaimers'))
      const current = (existing[0]?.value as any) ?? DEFAULT_DISCLAIMER
      const updated = { ...current, ...req.body, lastUpdatedAt: new Date().toISOString(), lastUpdatedBy: req.user!.uid }

      if (existing.length) {
        await db.update(config).set({ value: updated, updatedAt: new Date(), updatedBy: req.user!.uid }).where(eq(config.key, 'disclaimers'))
      } else {
        await db.insert(config).values({ key: 'disclaimers', value: updated, updatedBy: req.user!.uid })
      }

      res.json(updated)
    } catch (err) { next(err) }
  }
)

export default router
