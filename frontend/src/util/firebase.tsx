import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  onAuthStateChanged,
  browserSessionPersistence,
  User,
  signInWithRedirect
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // State to hold the current user

  useEffect(() => {
    // Set persistence
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user); // Update the user state
        });

        return unsubscribe; // Return the unsubscribe function
      })
      .catch((error) => {
        console.error('Error setting persistence: ', error);
      });
  }, []);

  return user; // Return the current user state
};

const createUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const loginWithGoogle = async () => {
  await signInWithRedirect(auth, provider);
};

const logout = async () => {
  return await signOut(auth);
};

const getCurrentUser = () => {
  return auth.currentUser;
};

export { useAuth, createUser, login, logout, getCurrentUser, loginWithGoogle };
