import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, User, Rocket } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (isGuest: boolean) => {
    if (!isGuest && name.trim().length < 3) {
      setError('Lütfen geçerli bir Ad Soyad girin (En az 3 karakter).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in anonymously for both modes (they act as temporary/local accounts stored in the cloud)
      const userCredential = await signInAnonymously(auth);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      const displayName = isGuest ? 'Misafir Astronot' : name.trim();

      if (!userDoc.exists()) {
        // Yeni kayıt
        await setDoc(userDocRef, {
          displayName,
          role: isGuest ? 'guest' : 'student',
          masteredAtoms: [],
          masteredModules: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      onLogin();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof FirebaseError && err.code === 'auth/operation-not-allowed') {
        setError("Firebase Konsolundan 'Anonymous' (Misafir) giriş yöntemi henüz aktifleştirilmemiş!");
      } else if (err instanceof FirebaseError && err.code === 'auth/admin-restricted-operation') {
         setError("Sisteme bağlanırken bir hata oluştu: Firebase: Error (auth/admin-restricted-operation). Lütfen Google Cloud Console üzerinden kimlik doğrulama ayarlarında 'Enable create (sign-up)' seçeneğini aktifleştirin.");
      } else {
        const message = err instanceof Error ? err.message : 'Bilinmeyen hata.';
        setError('Sisteme bağlanırken bir hata oluştu: ' + message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />
      <div className="absolute w-[100vw] h-[100vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 bg-[radial-gradient(circle,#00E5FF_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#12121A] border border-[#00E5FF]/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.1)] relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#00E5FF]/10 border border-[#00E5FF]/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Rocket className="w-10 h-10 text-[#00E5FF]" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white text-center mb-2 tracking-widest">UZAY ÜSSÜ</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Sisteme erişmek için kimliğini doğrula veya ziyaretçi protokolünü başlat.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Astronot Adı Soyadı</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Örn: Ayşe Yılmaz"
                disabled={loading}
                className="w-full bg-[#1F2833] border border-gray-700 focus:border-[#00E5FF] rounded-xl py-4 pl-12 pr-4 text-white outline-none transition-colors"
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(false); }}
              />
            </div>
          </div>

          <button 
            onClick={() => handleLogin(false)}
            disabled={loading || name.trim().length < 3}
            className="w-full py-4 bg-[#00E5FF] text-black font-black rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? 'Bağlanıyor...' : (
              <>Sisteme Giriş Yap <Fingerprint className="w-5 h-5" /></>
            )}
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <span className="bg-[#12121A] px-4 text-xs font-bold text-gray-600 relative z-10 uppercase">VEYA</span>
        </div>

        <button 
          onClick={() => handleLogin(true)}
          disabled={loading}
          className="w-full py-4 bg-transparent border border-gray-700 text-gray-300 font-bold rounded-xl hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 uppercase tracking-widest text-sm"
        >
          Misafir Astronot Olarak Devam Et
        </button>
      </motion.div>
    </div>
  );
}
