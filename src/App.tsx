import React, { useState, useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import LoginScreen from './components/auth/LoginScreen';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import type { DocumentData, Unsubscribe } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { useAtomStore, type UserRole } from './store/useAtomStore';
import { Loader2 } from 'lucide-react';

const normalizeRole = (role: unknown): UserRole => role === 'student' ? 'student' : 'guest';

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setFirestoreSync } = useAtomStore();

  useEffect(() => {
    let unsubscribeUserDoc: Unsubscribe | undefined;

    const syncUserData = (uid: string, data: DocumentData) => {
      setFirestoreSync(
        normalizeStringArray(data.masteredAtoms),
        normalizeStringArray(data.masteredModules),
        uid,
        typeof data.displayName === 'string' ? data.displayName : 'Astronot',
        normalizeRole(data.role)
      );
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
      unsubscribeUserDoc?.();
      unsubscribeUserDoc = undefined;

      if (user) {
        // Authenticated
        // Initial setup for the store from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          syncUserData(user.uid, userDoc.data());
        }

        // Keep listening for external changes (optional for real-time across tabs)
        unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            syncUserData(user.uid, docSnap.data());
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

    return () => {
      unsubscribeUserDoc?.();
      unsubscribeAuth();
    };
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
