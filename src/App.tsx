import React, { useState, useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import LoginScreen from './components/auth/LoginScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { useAtomStore } from './store/useAtomStore';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setFirestoreSync } = useAtomStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        // Authenticated
        // Initial setup for the store from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
           const data = userDoc.data();
           setFirestoreSync(
             data.masteredAtoms || [], 
             data.masteredModules || [],
             user.uid,
             data.displayName || 'Astronot',
             data.role || 'student'
           );
        }

        // Keep listening for external changes (optional for real-time across tabs)
        onSnapshot(userDocRef, (docSnap: any) => {
          if(docSnap.exists()){
            const data = docSnap.data();
            setFirestoreSync(
              data.masteredAtoms || [], 
              data.masteredModules || [],
              user.uid,
              data.displayName || 'Astronot',
              data.role || 'student'
            );
          }
        });

        setIsAuthenticated(true);
      } else {
        // Not authenticated
        setIsAuthenticated(false);
        setFirestoreSync([], [], null, '', 'guest');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setFirestoreSync]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center font-mono text-white">
        <Loader2 className="w-12 h-12 text-[#00E5FF] animate-spin mb-4" />
        <p className="text-[#00E5FF] tracking-widest animate-pulse">SİSTEM BAŞLATILIYOR...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return <AppRouter />;
}
