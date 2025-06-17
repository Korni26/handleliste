import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../Utils/Firestore";
import { useGetDatabaseData } from "./useGetDatabaseData";

type ValidUser = {
  id: string;
  email?: string;
};

const provider = new GoogleAuthProvider();

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(false);

  const validateUser = async () => {
    const validUsers: ValidUser[] =
      (await useGetDatabaseData("validUsers")) || [];
    if (user && user.email) {
      return validUsers.some((validUser) => validUser.email === user.email);
    }

    return false;
  };

  const validUsers = validateUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUser(user);
        validateUser().then((isValid) => setIsValidUser(!!isValid));
      } else {
        setUser(null);
        setIsValidUser(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [validUsers]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Feilet å logge inn: ", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsValidUser(false);
  };

  return { user, loading, isValidUser, signIn, logout };
};

export { useAuth };
