import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User as UserIcon, Shield, Hexagon, LogOut, CheckCircle, Award } from 'lucide-react';
import { useAtomStore } from '../../store/useAtomStore';
import { useGameStore } from '../../store/useGameStore';
import { auth } from '../../services/firebase';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Temporary map for 5th grade atoms until we build a full lookup system
const ATOM_NAMES: Record<string, string> = {
  // Tema 1 (3. Sınıf)
  'MAT.3.1.9.1': 'Bütün modelini sayısal kesir sembolleriyle eşleştirir.',
  'MAT.3.1.10.2': 'Birim kesirleri büyüklük açısından karşılaştırır.',
  'MAT.3.1.11.1': 'Kesir çizgisinin altındaki paydanın bütünü kaça böldüğünü ayırt eder.',
  'MAT.3.1.11.2': 'Kesir çizgisinin üstündeki payın alınan dilim sayısını verdiğini gösterir.',
  // Tema 1 (4. Sınıf)
  'MAT.4.1.1.1': '6 basamaklı sayıları bölüklerine ayırarak okur.',
  'MAT.4.1.3.1': 'Büyük veri bloklarını (6 haneli) büyüklüklerine göre sıralar.',
  'MAT.4.1.4.1': 'Büyük sayılar arasındaki ritmik örüntüyü keşfedip tamamlar.',
  // Tema 2 (4. Sınıf)
  'MAT.4.2.4.1': '10, 100, 1000 ile kısa yoldan zihinden işlem (Sıfır ekle/sil) yapar.',
  'MAT.4.2.5.1': 'Çarpma algoritmasında onlar basamağına geçerken bir basamak sola kaydırma kuralını uygular.',
  // Tema 1: Sayılar ve Nicelikler (5. Sınıf)
  'MAT.5.1.1.1': '7 basamaklı milyonlu sayıları abaküs/şekil ile okur.',
  'MAT.5.1.1.2': '8 basamaklı (on milyonlar) sayıları abaküs ile okur.',
  'MAT.5.1.1.3': '9 basamaklı (yüz milyonlar) sayıları abaküs ile okur.',
  'MAT.5.1.1.4': 'Milyonlu sayıları rakam sembolleriyle yazar.',
  'MAT.5.1.2.1': 'İçerisinde dört işlemin karmaşık olarak verildiği problemi adımlara böler.',
  'MAT.5.1.2.2': 'Adım adım işlem sırasıyla problem sonucunu nihayete erdirir.',
  'MAT.5.1.3.1': 'Bölme işleminden yola çıkarak (3/4) kesrine dönüştürür.',
  'MAT.5.1.3.2': 'Tam sayılı kesri, bileşik kesre çevirme simülasyonunu uygular.',
  'MAT.5.1.3.3': 'Bileşik kesri tam sayılı kesre çevirme simülasyonunu uygular.',
  'MAT.5.1.4.1': 'Paydaları farklı iki kesrin (örn: 1/2 ve 3/4) denk payda yöntemiyle büyüklüğünü sıralar.',
  'MAT.5.1.4.2': 'Bir doğal sayı ile bir kesri (örn: 2 > 3/2) karşılaştırır.',
  // Tema 2: İşlemlerden Cebirsel Düşünmeye
  'MAT.5.2.1.1': 'Terazinin iki kefesinde yer alan denklem dengesinin korunması kuralını ispatlar.',
  'MAT.5.2.1.2': 'Terazinin bir kefesine işlem yapıldığında diğer kefeye de aynı yapıldığında eşitliğin bozulmadığını uygular.',
  'MAT.5.2.2.1': 'İlk başta "Parantez İçi"nin yapılması işlem önceliği kuralını işletir.',
  'MAT.5.2.2.2': 'İşlem önceliğini (parantezli, çarpma, bölme) oyun algoritmasında uygular.',
  'MAT.5.2.3.1': 'Geometrik/sayısal bir örüntünün karmaşık n. adımını formülize edip tahmin eder.',
  'MAT.5.2.4.1': 'İşlemlerde (çarpma/bölme vb.) hata olan kısmı teşhis edip düzeltir.',
  // Tema 3: Nesnelerin Geometrisi
  'MAT.5.3.1.2': 'Dijital/Sanal araçla bir doğru parçası çizerek kodlar.',
  'MAT.5.3.2.1': 'Bir noktanın diğer noktaya göre konumunu yön/birim belirterek kodlar.'
};

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { masteredAtoms, masteredModules, displayName, role } = useAtomStore();
  const { score } = useGameStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Arka Plan Karartma */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sağ Panel */}
          <motion.div 
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-[#0B0C10] border-l border-gray-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Arka Plan Işıkları */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between relative z-10 bg-[#12121A]/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1F2833] border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">{displayName}</h2>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    {role === 'guest' ? 'Misafir Modu' : 'Uzay Kaşifi'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E5FF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Tab Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#12121A] border border-gray-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Hexagon className="w-8 h-8 text-[#00E5FF] mb-2" />
                  <span className="text-3xl font-black text-white">{masteredAtoms.length}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Kazanım</span>
                </div>
                <div className="bg-[#12121A] border border-gray-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Shield className="w-8 h-8 text-[#B388FF] mb-2" />
                  <span className="text-3xl font-black text-white">{masteredModules.length}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Modül</span>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-[#00E5FF]/10 to-[#B388FF]/10 border border-[#00E5FF]/20 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-sm text-gray-400 font-bold">Toplam Puan</div>
                      <div className="text-2xl font-black text-white">{score.toLocaleString()} XP</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kazanım Veritabanı */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00FF88]" /> Elde Edilen Kazanımlar
                </h3>
                
                {masteredAtoms.length === 0 ? (
                  <div className="border border-dashed border-gray-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center bg-[#12121A]/50">
                    <Hexagon className="w-8 h-8 text-gray-700 mb-3" />
                    <p className="text-sm text-gray-500 font-semibold">Henüz hiçbir kazanım mühürlenmedi. Antrenmanlara katıl ve ilk atomunu kazan!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Reverse map to show newest first conceptually */}
                    {[...masteredAtoms].reverse().map(atom => (
                      <div key={atom} className="bg-[#1F2833] border border-[#00FF88]/20 p-4 rounded-xl flex items-start gap-4">
                        <div className="bg-[#00FF88]/10 p-2 rounded-lg mt-0.5 shrink-0">
                          <Hexagon className="w-5 h-5 text-[#00FF88]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#00FF88] mb-1">{atom}</div>
                          <div className="text-sm text-gray-300 font-medium leading-relaxed">
                            {ATOM_NAMES[atom] || 'Veritabanında şifreli kazanım atomu.'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer / Çıkış */}
            <div className="p-6 border-t border-gray-800 bg-[#12121A]/80 backdrop-blur-md relative z-10">
              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-xl border border-red-500/30 text-red-500 flex items-center justify-center gap-2 hover:bg-red-500/10 font-bold transition-colors"
              >
                <LogOut className="w-5 h-5" /> 
                GÜVENLİ ÇIKIŞ YAP
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
