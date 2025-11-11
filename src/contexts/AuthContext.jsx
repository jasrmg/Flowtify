"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { logSystemAction } from "@/utils/systemLogger";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Login function
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Update last login
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp(),
        });

        // log the login action (only for admin)
        if (userData.role === "admin") {
          const userName =
            userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData.email;

          await logSystemAction({
            action: "Admin Login",
            description: `Admin ${userName} has logged into the system`,
            targetCollection: "users",
            targetId: user.uid,
            userId: user.uid,
            userRole: userData.role,
          });
        }

        return { success: true, role: userData.role };
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  }

  async function signup(email, password, firstName, lastName) {
    try {
      // 1. Create Firebase Auth account createUserWithEmailAndPassword
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Update Firebase Auth profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: "resident", // Default role
        avatarUrl: "", // Empty for now
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // 4. Log the signup action
      await logSystemAction({
        action: "User Registration",
        description: `New user ${firstName} ${lastName} (${email}) registered as resident`,
        targetCollection: "users",
        targetId: user.uid,
        userId: user.uid,
        userRole: "resident",
      });

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      }

      return { success: false, error: errorMessage };
    }
  }

  // Logout function
  async function logout() {
    try {
      // Log the logout action before signing out (only for admins)
      if (currentUser && userRole === "admin") {
        const userName =
          currentUser.firstName && currentUser.lastName
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : currentUser.email;

        await logSystemAction({
          action: "Admin Logout",
          description: `Admin ${userName} has logged out of the system`,
          targetCollection: "users",
          targetId: currentUser.uid,
          userId: currentUser.uid,
          userRole: userRole,
        });
      }

      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // refresh user data function
  async function refreshUser() {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...auth.currentUser, ...userData });
          setUserRole(userData.role);
        }
      }
    } catch (error) {
      console.error("Refresh user error.", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData });
          setUserRole(userData.role);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    signup,
    refreshUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
