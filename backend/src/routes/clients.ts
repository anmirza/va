import { Router } from 'express'
import { eq, desc, sql } from 'drizzle-orm'
import { body, param, validationResult } from 'express-validator'
import { db } from '../db'
import { clientCompanies, clientUsers, users, activityLog } from '../db/schema'
import { verifyToken, isAdmin, AuthRequest } from '../middleware/auth'
import { v4 as uuidv4 } from 'uuid'
import { auth as firebaseAuth } from '../lib/firebase-admin'

const router = Router()

function handleValidation(req: AuthRequest, res: any): boolean {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return false
  }
  return true
}

// GET /api/clients  — all client companies
router.get('/', verifyToken, isAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select().from(clientCompanies).orderBy(desc(clientCompanies.createdAt))
    res.json(rows)
  } catch (err) { next(err) }
})

// GET /api/clients/:id
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select().from(clientCompanies).where(eq(clientCompanies.id, String(req.params.id)))
    if (!rows.length) { res.status(404).json({ error: 'Client company not found' }); return }
    res.json(rows[0])
  } catch (err) { next(err) }
})

// GET /api/clients/by-user/:userId  — find company by user's companyId
router.get('/by-user/:userId', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const userRows = await db.select().from(users).where(eq(users.id, String(req.params.userId)))
    if (!userRows.length || !userRows[0].companyId) {
      res.status(404).json({ error: 'No company linked to this user' })
      return
    }
    const companyRows = await db.select().from(clientCompanies).where(eq(clientCompanies.id, userRows[0].companyId))
    if (!companyRows.length) { res.status(404).json({ error: 'Client company not found' }); return }
    res.json(companyRows[0])
  } catch (err) { next(err) }
})

// POST /api/clients  — create client company
router.post('/',
  verifyToken,
  isAdmin,
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('tokens').isInt({ min: 0 }).withMessage('Tokens must be a non-negative integer'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { name, holdingCompany, regionalHub, region, localCompany, country, tokens, packageSize, notes } = req.body
      const [company] = await db.insert(clientCompanies).values({
        id: uuidv4(),
        name,
        holdingCompany,
        regionalHub,
        region,
        localCompany,
        country,
        tokens: tokens ?? 0,
        tokensUsed: 0,
        packageSize: packageSize ?? 6,
        notes,
        status: 'active',
        createdByAdminId: req.user!.uid,
      }).returning()

      await db.insert(activityLog).values({
        type: 'org_create',
        description: `Created client company: ${name}`,
        userId: req.user!.uid,
      })

      res.status(201).json(company)
    } catch (err) { next(err) }
  }
)

// PATCH /api/clients/:id
router.patch('/:id',
  verifyToken,
  isAdmin,
  param('id').isUUID(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const allowed = ['name', 'holdingCompany', 'regionalHub', 'region', 'localCompany', 'country', 'tokens', 'packageSize', 'notes', 'status']
      const updates: Record<string, unknown> = {}
      for (const key of allowed) {
        if (key in req.body) updates[key] = req.body[key]
      }
      updates.updatedAt = new Date()

      const [updated] = await db.update(clientCompanies)
        .set(updates as any)
        .where(eq(clientCompanies.id, String(req.params.id)))
        .returning()

      if (!updated) { res.status(404).json({ error: 'Client company not found' }); return }
      res.json(updated)
    } catch (err) { next(err) }
  }
)

// POST /api/clients/:id/add-tokens  — add credits to company
router.post('/:id/add-tokens',
  verifyToken,
  isAdmin,
  param('id').isUUID(),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { amount } = req.body
      const [updated] = await db.update(clientCompanies)
        .set({ tokens: sql`tokens + ${amount}`, updatedAt: new Date() })
        .where(eq(clientCompanies.id, String(req.params.id)))
        .returning()

      if (!updated) { res.status(404).json({ error: 'Client company not found' }); return }
      res.json({ success: true, tokens: updated.tokens })
    } catch (err) { next(err) }
  }
)

// POST /api/clients/:id/deduct-token  — deduct 1 search credit (atomic)
router.post('/:id/deduct-token',
  verifyToken,
  param('id').isUUID(),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const rows = await db.select().from(clientCompanies).where(eq(clientCompanies.id, String(req.params.id)))
      if (!rows.length) { res.status(404).json({ error: 'Client company not found' }); return }

      const company = rows[0]
      const remaining = (company.tokens ?? 0) - (company.tokensUsed ?? 0)
      if (remaining <= 0) {
        res.status(400).json({ error: 'No credits remaining', remaining: 0 })
        return
      }

      const [updated] = await db.update(clientCompanies)
        .set({ tokensUsed: sql`tokens_used + 1`, updatedAt: new Date() })
        .where(eq(clientCompanies.id, String(req.params.id)))
        .returning()

      res.json({ success: true, remaining: (updated.tokens ?? 0) - (updated.tokensUsed ?? 0) })
    } catch (err) { next(err) }
  }
)

// ── Client Users ──────────────────────────────────────────────────────────────

// GET /api/clients/:id/users
router.get('/:id/users', verifyToken, isAdmin, async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select().from(clientUsers).where(eq(clientUsers.companyId, String(req.params.id) as any))
    res.json(rows)
  } catch (err) { next(err) }
})

// POST /api/clients/:id/users  — create client user
router.post('/:id/users',
  verifyToken,
  isAdmin,
  param('id').isUUID(),
  body('email').isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { email, name, password, role, mobile, region, country } = req.body
      const companyId = String(req.params.id)

      // Verify company exists
      const companyRows = await db.select().from(clientCompanies).where(eq(clientCompanies.id, String(companyId) as any))
      if (!companyRows.length) { res.status(404).json({ error: 'Client company not found' }); return }

      // Create Firebase Auth user
      const firebaseUser = await firebaseAuth.createUser({ email, password, displayName: name })

      // Set custom claims
      await firebaseAuth.setCustomUserClaims(firebaseUser.uid, { role: 'client' })

      // Insert into users + clientUsers tables
      const now = new Date()
      await db.insert(users).values({
        id: firebaseUser.uid,
        email,
        name,
        role: 'client',
        accountType: 'client',
        companyId,
        mobile,
        region,
        country,
        mustChangePassword: true,
        status: 'active',
      })

      const [clientUser] = await db.insert(clientUsers).values({
        id: firebaseUser.uid,
        companyId,
        name,
        email,
        role: role ?? 'client',
        mobile,
        region,
        country,
        status: 'active',
      }).returning()

      await db.insert(activityLog).values({
        type: 'invite',
        description: `Client user created: ${email}`,
        userId: req.user!.uid,
      })

      res.status(201).json(clientUser)
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        res.status(400).json({ error: 'A user with this email already exists' })
        return
      }
      next(err)
    }
  }
)

// PATCH /api/clients/:id/users/:userId
router.patch('/:id/users/:userId',
  verifyToken,
  isAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const allowed = ['name', 'role', 'mobile', 'region', 'country', 'status']
      const updates: Record<string, unknown> = {}
      for (const key of allowed) {
        if (key in req.body) updates[key] = req.body[key]
      }

      await Promise.all([
        db.update(clientUsers).set(updates as any).where(eq(clientUsers.id, String(req.params.userId))),
        db.update(users).set(updates as any).where(eq(users.id, String(req.params.userId))),
      ])

      res.json({ success: true })
    } catch (err) { next(err) }
  }
)

// DELETE /api/clients/:id/users/:userId  (suspend)
router.delete('/:id/users/:userId',
  verifyToken,
  isAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      await Promise.all([
        db.update(clientUsers).set({ status: 'suspended' }).where(eq(clientUsers.id, String(req.params.userId))),
        db.update(users).set({ status: 'suspended' }).where(eq(users.id, String(req.params.userId))),
      ])
      res.json({ success: true })
    } catch (err) { next(err) }
  }
)

export default router
