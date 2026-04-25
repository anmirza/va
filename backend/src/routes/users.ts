import { Router } from 'express'
import { eq, inArray } from 'drizzle-orm'
import { body, validationResult } from 'express-validator'
import { db } from '../db'
import { users, activityLog } from '../db/schema'
import { verifyToken, isAdmin, isSuperAdmin, AuthRequest } from '../middleware/auth'
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

// GET /api/users  — all users
router.get('/', verifyToken, isAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select().from(users)
    res.json(rows)
  } catch (err) { next(err) }
})

// GET /api/users/internal  — admin/super_admin/analyst users only
router.get('/internal', verifyToken, isAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select().from(users)
      .where(inArray(users.role, ['super_admin', 'admin', 'analyst']))
    res.json(rows)
  } catch (err) { next(err) }
})

// GET /api/users/:id
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    // Users can only fetch their own profile unless admin
    if (req.params.id !== req.user!.uid && !['admin', 'super_admin'].includes(req.user!.role ?? '')) {
      res.status(403).json({ error: 'Forbidden' }); return
    }
    const rows = await db.select().from(users).where(eq(users.id, String(req.params.id)))
    if (!rows.length) { res.status(404).json({ error: 'User not found' }); return }
    res.json(rows[0])
  } catch (err) { next(err) }
})

// POST /api/users/internal  — create internal VA user (admin/super_admin/analyst)
router.post('/internal',
  verifyToken,
  isSuperAdmin,
  body('email').isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['admin', 'analyst']).withMessage('Role must be admin or analyst'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req: AuthRequest, res, next) => {
    if (!handleValidation(req, res)) return
    try {
      const { email, name, role, password } = req.body

      const firebaseUser = await firebaseAuth.createUser({ email, password, displayName: name })
      await firebaseAuth.setCustomUserClaims(firebaseUser.uid, { role })

      const [user] = await db.insert(users).values({
        id: firebaseUser.uid,
        email,
        name,
        role,
        accountType: 'vendor',
        mustChangePassword: true,
        status: 'active',
      }).returning()

      await db.insert(activityLog).values({
        type: 'invite',
        description: `Internal user created: ${email} (${role})`,
        userId: req.user!.uid,
      })

      res.status(201).json(user)
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        res.status(400).json({ error: 'A user with this email already exists' })
        return
      }
      next(err)
    }
  }
)

// PATCH /api/users/:id  — update profile
router.patch('/:id', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    if (req.params.id !== req.user!.uid && !['admin', 'super_admin'].includes(req.user!.role ?? '')) {
      res.status(403).json({ error: 'Forbidden' }); return
    }

    const allowed = ['name', 'mobile', 'region', 'country', 'mustChangePassword', 'status']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }
    updates.updatedAt = new Date()

    const [updated] = await db.update(users)
      .set(updates as any)
      .where(eq(users.id, String(req.params.id)))
      .returning()

    if (!updated) { res.status(404).json({ error: 'User not found' }); return }
    res.json(updated)
  } catch (err) { next(err) }
})

// DELETE /api/users/:id  (suspend)
router.delete('/:id', verifyToken, isSuperAdmin, async (req: AuthRequest, res, next) => {
  try {
    await db.update(users).set({ status: 'suspended', updatedAt: new Date() }).where(eq(users.id, String(req.params.id)))
    res.json({ success: true })
  } catch (err) { next(err) }
})

// POST /api/users/sync  — called after Firebase login to upsert profile
// (replaces loadUserProfile + saveUserProfile in auth-context)
router.post('/sync', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const uid = req.user!.uid
    const existing = await db.select().from(users).where(eq(users.id, uid))

    if (!existing.length) {
      // New user — create profile from token data
      const [newUser] = await db.insert(users).values({
        id: uid,
        email: req.user!.email ?? '',
        name: req.body.name ?? '',
        role: req.user!.role ?? 'vendor',
        accountType: req.body.accountType ?? 'vendor',
        mustChangePassword: false,
        status: 'active',
      }).returning()
      res.json(newUser)
    } else {
      res.json(existing[0])
    }
  } catch (err) { next(err) }
})

export default router
