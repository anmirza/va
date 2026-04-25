import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDnyOHIr1v6WIgHNGZwx2ecAGmM8x69IRg",
  authDomain: "requisti-version.firebaseapp.com",
  projectId: "requisti-version",
  storageBucket: "requisti-version.firebasestorage.app",
  messagingSenderId: "52745790873",
  appId: "1:52745790873:web:b50b43fc8f0851810a5f08",
  measurementId: "G-EBT8LXK6G3",
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics is only available in browser environments
export const analyticsPromise = typeof window !== 'undefined'
  ? isSupported().then(yes => yes ? getAnalytics(app) : null)
  : Promise.resolve(null)

export default app
