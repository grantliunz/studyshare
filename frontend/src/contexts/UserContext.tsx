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
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from '../util/firebase';
import { UserDB } from '../types/types';
import useGet from '../hooks/useGet';
import usePost from '../hooks/usePost';
import { PostUser } from '../types/types';
import API from '../util/api';


interface AuthContextType {
  user: User | null;
  userDB : UserDB | null;
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
  const [userDB, setUserDB] = useState<UserDB | null>(null);

  const { postData: addUser } = usePost<PostUser, UserDB>( API.createUser );

  useEffect(() => {
    // Set persistence
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user); // Update the user state

          // Add user to the database
          if (user) {
            addUserDB(user.uid, user.email || '', user.displayName || '');
          }
          
          // Get user from DB
          const { data: userDBData } = useGet<UserDB>(`${API.getUser}/${user?.uid}`);

          setUserDB(userDBData);
        });

        return unsubscribe; // Return the unsubscribe function
      })
      .catch((error) => {
        console.error('Error setting persistence: ', error);
      });
  }, []);

  

  const createUser = async (name: string, email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await addUserDB(auth.currentUser?.uid || '', email, name);
  };

  const addUserDB = async (authId: string, email: string, name: string) => {
    const newUser: PostUser = {authId, email, name};
    await addUser(newUser);
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    // try {
      // Sign in with Google
      await signInWithRedirect(auth, provider);
  
    //   // Get result after successful login
    //   const result = await getRedirectResult(auth);
  
    //   // Check if user exists in the database
    //   if (result?.user) {
    //     const { data: existingUser } = await useGet<UserDB>(`${API.getUser}/${result.user.uid}`);
        
    //     // If user doesn't exist, create a new user in the database
    //     if (!existingUser) {
    //       // Add user to the database
    //       await addUserDB(result.user.uid, result.user.email || '', result.user.displayName || '');
    //     }
    //   }


    // } catch (error) {
    //   console.error('Error signing in with Google: ', error);
    // }
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
        userDB,
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
