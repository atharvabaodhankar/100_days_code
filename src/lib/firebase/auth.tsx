"use client";

import * as React from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  User as FirebaseUser,
  getAuth,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app, db } from "./client";
import { env } from "../env";

export interface StudentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubUsername?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: StudentUser | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isAdmin: false,
  loading: true,
  signInWithGithub: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
});

const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<StudentUser | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const checkIsAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    return (
      cleanEmail === "baodhankaratharva@gmail.com" ||
      env.ADMIN_EMAILS.includes(cleanEmail)
    );
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          const githubData = fbUser.providerData.find(
            (p) => p.providerId === "github.com"
          );
          const githubUsername = (fbUser as any).reloadUserInfo?.screenName || githubData?.displayName || fbUser.displayName || "";
          const isAdminUser = checkIsAdmin(fbUser.email);

          let studentData: StudentUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            githubUsername: githubUsername,
            isAdmin: isAdminUser,
            createdAt: new Date().toISOString(),
          };

          if (userDoc.exists()) {
            studentData = { ...studentData, ...(userDoc.data() as StudentUser), isAdmin: isAdminUser };
          } else {
            await setDoc(userDocRef, studentData, { merge: true });
          }

          setUser(studentData);
        } catch (err) {
          console.error("Error syncing user document:", err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            isAdmin: checkIsAdmin(fbUser.email),
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
      const githubUsername = (fbUser as any).reloadUserInfo?.screenName || fbUser.displayName || "";
      const isAdminUser = checkIsAdmin(fbUser.email);

      const studentData: StudentUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        githubUsername,
        isAdmin: isAdminUser,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", fbUser.uid), studentData, { merge: true });
      setUser(studentData);
    } catch (err: any) {
      console.error("GitHub sign-in error:", err);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdminUser = checkIsAdmin(fbUser.email);

      const studentData: StudentUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        isAdmin: isAdminUser,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", fbUser.uid), studentData, { merge: true });
      setUser(studentData);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const deleteAccount = async () => {
    const currentFbUser = auth.currentUser;
    if (!currentFbUser) {
      throw new Error("No active user session found.");
    }
    const uid = currentFbUser.uid;

    // 1. Delete Firestore User Document
    try {
      await deleteDoc(doc(db, "users", uid));
    } catch (e) {
      console.warn("Could not delete user doc:", e);
    }

    // 2. Delete Leaderboard Entry
    try {
      await deleteDoc(doc(db, "leaderboard", uid));
    } catch (e) {
      console.warn("Could not delete leaderboard doc:", e);
    }

    // 3. Delete Streaks Document
    try {
      await deleteDoc(doc(db, "streaks", uid));
    } catch (e) {
      console.warn("Could not delete streak doc:", e);
    }

    // 4. Delete All Submissions of this user
    try {
      const subsQuery = query(collection(db, "submissions"), where("uid", "==", uid));
      const subsSnap = await getDocs(subsQuery);
      for (const d of subsSnap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {
      console.warn("Could not delete submissions:", e);
    }

    // 5. Delete Firebase Auth User
    await currentFbUser.delete();

    // 6. Reset local state
    setUser(null);
    setFirebaseUser(null);
  };

  const isAdmin = checkIsAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAdmin,
        loading,
        signInWithGithub,
        signInWithGoogle,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
