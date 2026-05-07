import { Router } from 'express'
import { eq, desc } from 'drizzle-orm'
import { body, param, validationResult } from 'express-validator'
import { db } from '../db'
import { pendingRegistrations, organisations, activityLog } from '../db/schema'
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

// GET /api/registrations
router.get('/', verifyToken, isAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select().from(pendingRegistrations).orderBy(desc(pendingRegistrations.submittedAt))
    res.json(rows)
  } catch (err) { next(err) }
})

// GET /api/registrations/:id
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select().from(pendingRegistrations).where(eq(pendingRegistrations.id, String(req.params.id)))
    if (!rows.length) { res.status(404).json({ error: 'Registration not found' }); return }
    res.json(rows[0])
  } catch (err) { next(err) }
})

// POST /api/registrations  — submit a new registration
router.post('/',
  verifyToken,
  body('type').trim().notEmpty(),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { type, companyName, profileData } = req.body
      const id = uuidv4()

      const [reg] = await db.insert(pendingRegistrations).values({
        id,
        type,
        companyName,
        submittedByUserId: req.user!.uid,
        submittedByName:   req.body.submittedByName  ?? '',
        submittedByEmail:  req.body.submittedByEmail ?? req.user!.email ?? '',
        status: 'pending',
        profileData,
      }).returning()

      await db.insert(activityLog).values({
        type: 'signup',
        description: `New ${type} registration: ${companyName}`,
        userId: req.user!.uid,
      })

      res.status(201).json(reg)
    } catch (err) { next(err) }
  }
)

// POST /api/registrations/:id/approve
router.post('/:id/approve',
  verifyToken,
  isAdmin,
  param('id').notEmpty(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const rows = await db.select().from(pendingRegistrations).where(eq(pendingRegistrations.id, String(req.params.id)))
      if (!rows.length) { res.status(404).json({ error: 'Registration not found' }); return }
      const reg = rows[0]

      // Update registration status
      await db.update(pendingRegistrations)
        .set({ status: 'approved', approvedAt: new Date(), approvedByAdminId: req.user!.uid })
        .where(eq(pendingRegistrations.id, String(req.params.id)))

      // Create organisation record
      const [org] = await db.insert(organisations).values({
        id: uuidv4(),
        type: reg.type,
        name: reg.companyName,
        status: 'active',
        memberCount: 0,
        registrationId: reg.id,
        profileData: reg.profileData as any,
        createdByAdminId: req.user!.uid,
      }).returning()

      await db.insert(activityLog).values({
        type: 'approval',
        description: `Approved ${reg.type}: ${reg.companyName}`,
        userId: req.user!.uid,
      })

      res.json({ success: true, org })
    } catch (err) { next(err) }
  }
)

// POST /api/registrations/:id/reject
router.post('/:id/reject',
  verifyToken,
  isAdmin,
  param('id').notEmpty(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const rows = await db.select().from(pendingRegistrations).where(eq(pendingRegistrations.id, String(req.params.id)))
      if (!rows.length) { res.status(404).json({ error: 'Registration not found' }); return }
      const reg = rows[0]

      await db.update(pendingRegistrations)
        .set({ status: 'rejected', rejectedAt: new Date(), rejectedByAdminId: req.user!.uid, rejectionReason: req.body.reason ?? '' })
        .where(eq(pendingRegistrations.id, String(req.params.id)))

      await db.insert(activityLog).values({
        type: 'rejection',
        description: `Rejected ${reg.type}: ${reg.companyName}`,
        userId: req.user!.uid,
      })

      res.json({ success: true })
    } catch (err) { next(err) }
  }
)

export default router
