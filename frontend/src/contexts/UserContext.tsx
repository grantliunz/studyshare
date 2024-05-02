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
  signInWithPopup
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from '../util/firebase';
import usePost from '../hooks/usePost';
import API from '../util/api';
import { PostUser, UserDb } from '../types/user';
import { mapGetUserData } from '../mappers/userMapper';

interface AuthContextType {
  user: User | null;
  userDB: UserDb | null;
  refreshUserDb: () => void;
  createUser(name: string, email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDB: null,
  createUser: async () => {},
  refreshUserDb: () => {},
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
  const [userDB, setUserDB] = useState<UserDb | null>(null);
  const { postData: addUser } = usePost<PostUser, UserDb>(
    API.createUser,
    mapGetUserData
  );

  useEffect(() => {
    // Set persistence
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user); // Update the user state

          // If the user is logged in, add the user to the database
          if (user) {
            addUserDB(user.uid, user.email || '', user.displayName || '');
          }
        });

        return unsubscribe; // Return the unsubscribe function
      })
      .catch((error) => {
        console.error('Error setting persistence: ', error);
      });
  }, []);

  const refreshUserDb = () => {
    if (user) {
      addUserDB(user.uid, user.email || '', user.displayName || '');
    }
  };

  const createUser = async (name: string, email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await addUserDB(auth.currentUser?.uid || '', email, name);
  };

  const addUserDB = async (authId: string, email: string, name: string) => {
    const newUser: PostUser = { authId, email, name };
    const userDbData = await addUser(newUser);
    if (userDbData instanceof Error) {
      console.error('Error adding user to database:', userDbData);
    } else {
      console.log(userDbData);
      setUserDB(userDbData);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    setUserDB(null);
    return await signOut(auth);
  };

  const getCurrentUser = () => {
    return auth.currentUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDB,
        refreshUserDb,
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
