import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnap = null;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            puzzles_completed: 0,
          })
        }
        unsubscribeSnap = onSnapshot(docRef, (docSnap) => {
          setUserData(docSnap.data());
        });
      }
      else{
        setUser(null);
        setUserData(null);
      }
      setLoading(false);  
    });

     return () => {
      unsubscribe();
      if (unsubscribeSnapshot){
        unsubscribeSnapshot();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData}}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
