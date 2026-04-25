import { Request, Response, NextFunction } from 'express'
import { auth } from '../lib/firebase-admin'

export interface AuthRequest extends Request {
  user?: {
    uid: string
    email?: string
    role?: string
  }
}

// ── DEV_MODE UID → role mapping ───────────────────────────────────────────────
const DEV_USERS: Record<string, { email: string; role: string }> = {
  'superadmin-uid': { email: 'superadmin@va-consulting.com', role: 'super_admin' },
  'admin-uid':      { email: 'admin@va-consulting.com',      role: 'admin'       },
  'vendor-uid':     { email: 'demo@requisti.com',            role: 'vendor'      },
  'client-uid':     { email: 'client@requisti.com',          role: 'client'      },
}

export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }

  const token = authHeader.split('Bearer ')[1]

  // ── DEV_MODE: skip Firebase verification ─────────────────────────────────
  if (process.env.DEV_MODE === 'true' && token.startsWith('dev_')) {
    const uid = token.replace('dev_', '')
    const devUser = DEV_USERS[uid]
    if (!devUser) {
      res.status(401).json({ error: `DEV_MODE: unknown dev uid "${uid}". Valid: ${Object.keys(DEV_USERS).join(', ')}` })
      return
    }
    req.user = { uid, email: devUser.email, role: devUser.role }
    next()
    return
  }

  // ── PRODUCTION: verify Firebase ID token ─────────────────────────────────
  try {
    const decoded = await auth.verifyIdToken(token)
    req.user = {
      uid:   decoded.uid,
      email: decoded.email,
      role:  (decoded.role as string) ?? 'user',
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role ?? '')) {
      res.status(403).json({ error: 'Forbidden: insufficient permissions' })
      return
    }
    next()
  }
}

export const isAdmin     = requireRole('admin', 'super_admin')
export const isSuperAdmin = requireRole('super_admin')

