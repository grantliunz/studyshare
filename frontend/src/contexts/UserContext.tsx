import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from '../util/firebase';

interface AuthContextType {
  user: User | null;
  createUser(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  createUser: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  getCurrentUser: () => null
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  const createUser = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        createUser,
        getCurrentUser,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
