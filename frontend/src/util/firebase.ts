export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID
};

export function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'User not found. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/missing-password':
      return 'Please enter a password.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak. Passwords needs to be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'There was a network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/invalid-credential':
      return 'Incorrect login credentials. Please try again.';
    default:
      return 'An unknown error occurred.';
  }
}
