/**
 * firestore-seed.ts
 * One-shot idempotent seeder — writes default step labels for agency & production
 * into Firestore so the Settings page and signup forms have something to work with.
 * Safe to call on every app start; the "seeded" flag prevents double-writes.
 */
import { getDoc, setDoc, doc } from 'firebase/firestore'
import { db } from './firebase'
import { REGISTRATION_STEPS } from './rfi-data'
import { RFI_SCHEMA_SEEDS } from './rfi-schema-seed'

const PRODUCTION_STEPS = [
  { key: 'general-info',        label: 'General Info',        shortLabel: 'General'     },
  { key: 'organisation',        label: 'Organisation',        shortLabel: 'Org'         },
  { key: 'address',             label: 'Address',             shortLabel: 'Address'     },
  { key: 'about',               label: 'About',               shortLabel: 'About'       },
  { key: 'contacts',            label: 'Contacts',            shortLabel: 'Contacts'    },
  { key: 'social-media',        label: 'Social Media',        shortLabel: 'Social'      },
  { key: 'turnover-clients',    label: 'Turnover & Clients',  shortLabel: 'Turnover'    },
  { key: 'competencies',        label: 'Competencies',        shortLabel: 'Skills'      },
  { key: 'post-production',     label: 'Post-Production',     shortLabel: 'Post'        },
  { key: 'people-directors',    label: 'People & Directors',  shortLabel: 'People'      },
  { key: 'awards-csr',          label: 'Awards & CSR',        shortLabel: 'Awards'      },
  { key: 'governance-ai',       label: 'Governance & AI',     shortLabel: 'Governance'  },
  { key: 'attachments',         label: 'Attachments',         shortLabel: 'Attach'      },
]

export async function ensureFirestoreSeedFS(): Promise<void> {
  try {
    const flagSnap = await getDoc(doc(db, 'config', 'seeded'))
    const flag = flagSnap.exists() ? flagSnap.data() : {}

    // ── Step labels ──
    if (flag?.stepLabels !== true) {
      await setDoc(doc(db, 'config', 'rfiStepLabels'), {
        'cat-agency': REGISTRATION_STEPS.map(s => ({ ...s })),
        'cat-production': PRODUCTION_STEPS,
      }, { merge: true })
    }

    // ── Field schemas (only seed missing categories so admin edits aren't overwritten) ──
    if (flag?.rfiFields !== true) {
      const fieldsSnap = await getDoc(doc(db, 'config', 'rfiFields'))
      const existing = fieldsSnap.exists() ? fieldsSnap.data() ?? {} : {}
      const merged: Record<string, unknown> = { ...existing }
      for (const [catId, seed] of Object.entries(RFI_SCHEMA_SEEDS)) {
        if (!Array.isArray(existing[catId]) || (existing[catId] as unknown[]).length === 0) {
          merged[catId] = seed
        }
      }
      await setDoc(doc(db, 'config', 'rfiFields'), merged, { merge: true })
    }

    // Mark as seeded
    await setDoc(doc(db, 'config', 'seeded'), { stepLabels: true, rfiFields: true }, { merge: true })
  } catch {
    // Non-fatal — silently ignore (e.g. offline or permission error)
  }
}
