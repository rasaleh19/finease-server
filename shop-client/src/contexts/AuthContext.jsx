import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import app from "../firebase/firebase.init";

const AuthContext = createContext();
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    async function setupPersistenceAndListener() {
      await setPersistence(auth, browserLocalPersistence);
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser && currentUser.email) {
          // Fetch user from backend by email to get the id field
          try {
            const res = await fetch(
              `http://localhost:3000/users?email=${currentUser.email}`
            );
            const users = await res.json();
            if (users && users.length > 0) {
              // Merge backend user info (id, name, etc) into Firebase user
              setUser({ ...currentUser, ...users[0] });
            } else {
              setUser(currentUser);
            }
          } catch (err) {
            console.log("Failed to fetch user from backend:", err);
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
    let unsubscribe;
    setupPersistenceAndListener().then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth]);

  const logout = () => signOut(auth);
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, googleSignIn, auth }}>
      {children}
    </AuthContext.Provider>
  );
}
