"use client";

import * as React from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GithubAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "./client";
import { getAuth } from "firebase/auth";

export interface StudentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubUsername?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: StudentUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signInWithGithub: async () => {},
  signOut: async () => {},
});

const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<StudentUser | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          // Extract GitHub username from provider data if available
          const githubData = fbUser.providerData.find(
            (p) => p.providerId === "github.com"
          );
          const githubUsername = (fbUser as any).reloadUserInfo?.screenName || githubData?.displayName || fbUser.displayName || "";

          let studentData: StudentUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            githubUsername: githubUsername,
            createdAt: new Date().toISOString(),
          };

          if (userDoc.exists()) {
            studentData = { ...studentData, ...(userDoc.data() as StudentUser) };
          } else {
            // Create user document in Firestore on first login
            await setDoc(userDocRef, studentData, { merge: true });
          }

          setUser(studentData);
        } catch (err) {
          console.error("Error syncing student user document:", err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const fbUser = result.user;
      const credential = GithubAuthProvider.credentialFromResult(result);
      const githubUsername = (fbUser as any).reloadUserInfo?.screenName || fbUser.displayName || "";

      const studentData: StudentUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        githubUsername,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", fbUser.uid), studentData, { merge: true });
      setUser(studentData);
    } catch (err: any) {
      console.error("GitHub sign-in error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
