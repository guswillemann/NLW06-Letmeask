import { useState } from "react";
import { useEffect } from "react";
import { ReactNode } from "react";
import { createContext } from "react";
import { firebase, auth } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProviderProps = {
  children: ReactNode;
}

export default function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user
      
        if (!displayName || !photoURL) throw new Error('Missing information from Google Account.');
        
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })
    return () => unsubscribe();
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    
    if (result.user) {
      const { displayName, photoURL, uid } = result.user
      
      if (!displayName || !photoURL) throw new Error('Missing information from Google Account.');
      
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
