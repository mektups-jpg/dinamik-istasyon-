import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { modules, ModuleMeta } from '../registry/moduleRegistry';
import { useGameStore } from '../store/useGameStore';
import { useAtomStore } from '../store/useAtomStore';
import { Battery, Play, Lock, ChevronLeft, Hexagon, Fingerprint, X } from 'lucide-react';
import Bot from '../components/characters/Bot';

export default function Dashboard() {
  const { score } = useGameStore();
  const { masteredModules } = useAtomStore();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const getModulesForGrade = (grade: number): ModuleMeta[] => {
    switch(grade) {
      case 1: return modules.filter(m => m.id === 'number-line' || m.id === 'number-line-sub');
      case 2: return modules.filter(m => m.id === 'base-10-factory');
      case 3: return [];
      case 4: return [];
      case 5: return modules.filter(m => m.id === 'magnitude-core' || m.id === 'equation-lab');
      case 6: return modules.filter(m => m.id === 'absolute-value' || m.id === 'gear-ratio');
      case 7: return modules.filter(m => m.id === 'identity-blocks' || m.id === 'pythagoras');
      case 8: return modules.filter(m => m.gradeRange === 'Ortaokul' && !['absolute-value', 'gear-ratio', 'identity-blocks', 'pythagoras'].includes(m.id));
      case 9: return [];
      case 10: return [];
      case 11: return modules.filter(m => m.id === 'trig-pendulum' || m.id === 'unit-circle' || m.id === 'slope-rollercoaster');
      case 12: return modules.filter(m => m.id === 'galton-board' || m.id === 'laser-defense');
      default: return [];
    }
  };

  const getBotMessage = () => {
    if (selectedGrade === null) return "Matnastik Laboratuvarı'na Hoş Geldin! Giriş yapmak istediğin laboratuvar kapısını seç.";
    const count = getModulesForGrade(selectedGrade).length;
    if (count === 0) return `${selectedGrade}. Sınıf reaktörleri şu an inşa ediliyor komutanım! Lütfen başka bir kapı dene.`;
    return `${selectedGrade}. Sınıf laboratuvarlarında seni ${count} aktif görev bekliyor. Tıkla ve başlat!`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white font-sans overflow-x-hidden relative selection:bg-[#00E5FF] selection:text-[#0B0C10]">
      {/* Arka Plan Efektleri */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00E5FF]/5 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#B388FF]/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* HEADER (Navbar) */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12">
            <Hexagon className="w-12 h-12 text-[#00E5FF] absolute animate-[spin_10s_linear_infinite]" strokeWidth={1} />
            <Fingerprint className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              MATNASTİK<span className="text-[#00E5FF]">.</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">Laboratuvarı</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* TOTAL PROGRESS */}
          {(() => {
            const TOTAL_MODULES = 73;
            // Geliştirme ilerlemesi: Kayıtlı olan modül sayısı
            const completedCount = modules.length;
            const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_MODULES) * 100));

            return (
              <div className="flex flex-col items-end mr-2 md:mr-4">
                <div className="flex items-end gap-2 mb-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:inline">Geliştirme Süreci</span>
                  <span className="text-sm font-black text-[#00E5FF] leading-none">%{progressPercent}</span>
                </div>
                <div className="w-24 sm:w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#B388FF] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                  {completedCount} / {TOTAL_MODULES} MODÜL ÜRETİLDİ
                </span>
              </div>
            );
          })()}

          {/* XP BATTERY */}
          <div className="flex items-center gap-3 bg-[#121212]/80 backdrop-blur-md px-4 sm:px-5 py-2.5 rounded-2xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <Battery className="w-6 h-6 text-[#00E5FF] hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Enerji</span>
              <span className="text-lg font-black text-white leading-none mt-1">{score} <span className="text-[#00E5FF] text-sm">XP</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* ANA İÇERİK MİMARİSİ */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-8 pb-32">
        <AnimatePresence mode="wait">
          {selectedGrade === null ? (
            <motion.div 
              key="doors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Görev <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#B388FF]">Sektörünü</span> Seç</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Aşağıdaki cam kapılardan birine tıklayarak MEB standartlarındaki interaktif laboratuvarlara giriş yap.
                </p>
              </div>

              {/* 12 CAM KAPI */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                  <GradeDoor 
                    key={grade} 
                    grade={grade} 
                    moduleCount={getModulesForGrade(grade).length}
                    onClick={() => setSelectedGrade(grade)} 
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <button 
                onClick={() => setSelectedGrade(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 group"
              >
                <div className="bg-[#121212] p-2 rounded-full border border-gray-800 group-hover:border-gray-500 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <span className="font-bold tracking-wider uppercase text-sm">Ana Sektöre Dön</span>
              </button>

              <div className="flex items-end justify-between mb-10 border-b border-gray-800 pb-6">
                <div>
                  <h2 className="text-4xl font-black text-white">{selectedGrade}. Sınıf <span className="text-[#00E5FF]">Laboratuvarı</span></h2>
                  <p className="text-gray-400 mt-2 text-lg">Bu laboratuvarda görevler seni bekliyor.</p>
                </div>
              </div>

              {getModulesForGrade(selectedGrade).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#121212]/50 rounded-3xl border border-dashed border-gray-800">
                  <Lock className="w-16 h-16 text-gray-700 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-500 mb-2">Bu Tesis İnşa Halinde 🚧</h3>
                  <p className="text-gray-600 max-w-md text-center">Geliştirici ekibimiz kuantum hesaplamalarını yapıyor. Pek yakında burada yepyeni modüller olacak!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getModulesForGrade(selectedGrade).map(mod => (
                    <ModuleCard key={mod.id} mod={mod} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ASTRO-BOT (Rehber) */}
      <AstroBot message={getBotMessage()} />
    </div>
  );
}


// --- ALT BİLEŞENLER ---

function GradeDoor({ grade, moduleCount, onClick }: { grade: number, moduleCount: number, onClick: () => void }) {
  const isLocked = moduleCount === 0;

  return (
    <motion.button 
      whileHover={{ y: -5, boxShadow: isLocked ? 'none' : '0 10px 30px rgba(0,229,255,0.15)' }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative aspect-[3/4] w-full rounded-3xl flex flex-col items-center justify-between p-6 overflow-hidden border transition-colors ${
        isLocked 
          ? 'bg-[#121212]/40 border-gray-900/50 grayscale opacity-70 cursor-not-allowed hidden-or-locked' 
          : 'bg-[#121212]/80 backdrop-blur-xl border-gray-800 hover:border-[#00E5FF]/40 cursor-pointer'
      }`}
    >
      {/* Parlama Efekti */}
      {!isLocked && (
        <div className="absolute -inset-2 bg-gradient-to-t from-[#00E5FF]/20 to-transparent opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
      )}

      {/* Sayaç veya Kilit */}
      <div className="w-full flex justify-end relative z-10">
        {isLocked ? (
          <Lock className="w-5 h-5 text-gray-700" />
        ) : (
          <div className="bg-[#1F2833] border border-gray-700 text-[#00E5FF] text-[10px] font-bold px-2.5 py-1 rounded-full">
            {moduleCount} GÖREV
          </div>
        )}
      </div>

      {/* Sınıf Numarası */}
      <div className={`text-7xl font-black tracking-tighter relative z-10 ${isLocked ? 'text-gray-800' : 'text-white'}`}>
        {grade}
      </div>

      {/* Etiket */}
      <div className="w-full text-center relative z-10">
        <p className={`text-xs font-bold uppercase tracking-widest ${isLocked ? 'text-gray-700' : 'text-gray-400'}`}>Sınıf</p>
      </div>

      {/* Alt Vurgu Çizgisi */}
      {!isLocked && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent"></div>
      )}
    </motion.button>
  );
}


function ModuleCard({ mod }: { mod: ModuleMeta }) {
  const { isMastered } = useAtomStore();
  const completed = isMastered(`fake-id-${mod.id}`); // Geliştirilecek
  
  return (
    <Link 
      to={mod.path} 
      className="group relative flex flex-col bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-gray-800 overflow-hidden hover:border-[#00E5FF]/40 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-3xl group-hover:bg-[#00E5FF]/10 transition-colors"></div>
      
      <div className="p-8 pb-6 flex-1 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-[#1F2833] border border-gray-700/50 p-3 rounded-2xl">
            <Play className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform" fill="currentColor" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00E5FF]/10 text-[#00E5FF] px-3 py-1.5 rounded-full border border-[#00E5FF]/20">
            {mod.category}
          </span>
        </div>
        
        <h4 className="text-xl font-bold text-white mb-3 leading-tight">{mod.title}</h4>
        <p className="text-sm text-gray-400 line-clamp-3">{mod.description}</p>
      </div>
      
      <div className="p-8 pt-0 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-[#00E5FF] to-[#B388FF] rounded-full transition-all duration-1000 ${completed ? 'w-full' : 'w-0 group-hover:w-[15%]'}`} />
          </div>
          <span className="text-xs font-bold text-gray-500">{completed ? '100%' : '0%'}</span>
        </div>
      </div>
    </Link>
  );
}


function AstroBot({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true);

  // Mesaj değiştiğinde balonu tekrar göster
  React.useEffect(() => {
    setIsVisible(true);
  }, [message]);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className="fixed bottom-8 right-8 flex items-end gap-4 z-50 pointer-events-none"
    >
      {/* Konuşma Baloncugu */}
      <AnimatePresence mode="wait">
        {message && isVisible && (
          <motion.div 
            key={message}
            initial={{ opacity: 0, scale: 0.8, y: 10, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-[#1F2833]/95 backdrop-blur-xl border border-gray-700 text-white p-4 pt-6 rounded-2xl rounded-br-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-[280px] mb-8 relative pointer-events-auto"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-medium leading-relaxed pr-1">{message}</p>
            {/* Küçük Ok */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#1F2833] border-b border-r border-gray-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative pb-2">
        <Bot state="idle" direction={-1} />
      </div>
    </motion.div>
  );
}
