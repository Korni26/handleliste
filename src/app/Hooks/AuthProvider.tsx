"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import db, { auth } from "../Utils/Firestore";

type AuthState = {
  user: User | null;
  loading: boolean;
  isValidUser: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);
const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    let active = true;
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      const current = ++generation;
      setLoading(true);
      setUser(nextUser);
      setIsValidUser(false);
      if (!nextUser?.email) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDocs(collection(db, "validUsers"));
        if (!active || current !== generation) return;
        const email = nextUser.email.trim().toLowerCase();
        setIsValidUser(snapshot.docs.some((doc) => {
          const approvedEmail = doc.data().email;
          return typeof approvedEmail === "string" &&
            approvedEmail.trim().toLowerCase() === email;
        }));
      } catch (error) {
        if (active && current === generation) {
          console.error("Unable to validate user:", error);
          setIsValidUser(false);
        }
      } finally {
        if (active && current === generation) setLoading(false);
      }
    }, (error) => {
      if (!active) return;
      console.error("Authentication listener error:", error);
      setUser(null);
      setIsValidUser(false);
      setLoading(false);
    });
    return () => { active = false; generation++; unsubscribe(); };
  }, []);

  const value = useMemo<AuthState>(() => ({
    user, loading, isValidUser,
    signIn: async () => { await signInWithPopup(auth, provider); },
    logout: async () => { await signOut(auth); },
  }), [user, loading, isValidUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires an AuthProvider");
  return context;
}
