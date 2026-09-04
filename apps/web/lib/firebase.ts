import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;

  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

/**
 * Initializes an invisible or standard RecaptchaVerifier on a DOM element container
 */
export function createRecaptchaVerifier(
  containerId: string,
  auth: Auth,
  onExpired?: () => void
): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with phone sign in
    },
    'expired-callback': () => {
      if (onExpired) onExpired();
    },
  });
}
