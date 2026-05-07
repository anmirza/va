import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const isDevMode = process.env.DEV_MODE === 'true'
const hasCredentials = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
)

if (!admin.apps.length) {
  if (hasCredentials) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  } else if (isDevMode) {
    // DEV_MODE without credentials: init with projectId only so admin.auth() exists.
    // Firebase token verification will fail, but dev_<uid> tokens bypass verification.
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? 'dev-project' })
    console.warn('⚠️  Firebase Admin running in DEV_MODE without service account credentials. Use "Bearer dev_<uid>" tokens.')
  } else {
    throw new Error('Firebase Admin credentials are missing. Set FIREBASE_* env vars or enable DEV_MODE=true for local dev.')
  }
}

export const firebaseAdmin = admin
export const auth = admin.auth()
