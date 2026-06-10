import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { activeModules, archivedModules, ModuleMeta } from '../registry/moduleRegistry';
import { useGameStore } from '../store/useGameStore';
import { useAtomStore } from '../store/useAtomStore';
import { Battery, Play, Lock, ChevronLeft, Hexagon, Fingerprint, X, User as UserIcon, LogOut } from 'lucide-react';
import Bot from '../components/characters/Bot';
import { auth } from '../services/firebase';
import { AstroBot, BotMessage } from '../components/ui/AstroBot';
import { ProfilePanel } from '../components/ui/ProfilePanel';
import {
  WORKFLOW_SCOPE_EVENT,
  getStoredWorkflowScope,
  isGradeInWorkflowScope,
  setStoredWorkflowScope,
  workflowScopeCopy,
  type WorkflowScope,
} from './workflowScope';

export default function Dashboard() {
  const { score } = useGameStore();
  const { masteredModules, masteredAtoms, displayName, role } = useAtomStore();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [workflowScope, setWorkflowScope] = useState<WorkflowScope>(() => getStoredWorkflowScope());
  const scopeIsLimited = workflowScope !== 'all';

  useEffect(() => {
    setStoredWorkflowScope('Lise');
    const syncScope = () => setWorkflowScope(getStoredWorkflowScope());
    window.addEventListener('storage', syncScope);
    window.addEventListener(WORKFLOW_SCOPE_EVENT, syncScope);
    return () => {
      window.removeEventListener('storage', syncScope);
      window.removeEventListener(WORKFLOW_SCOPE_EVENT, syncScope);
    };
  }, []);

  useEffect(() => {
    if (selectedGrade !== null && !isGradeInWorkflowScope(selectedGrade, workflowScope)) {
      setSelectedGrade(null);
    }
  }, [selectedGrade, workflowScope]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getModulesForGrade = (grade: number): ModuleMeta[] => {
    return activeModules.filter(m => m.grade === grade);
  };

  const getArchivedModulesForGrade = (grade: number): ModuleMeta[] => {
    return archivedModules.filter(m => m.grade === grade);
  };

  const getBotMessage = (): BotMessage => {
    let text = scopeIsLimited
      ? `Hoş geldin ${displayName}! ${workflowScopeCopy[workflowScope].label}; yalnız ${workflowScopeCopy[workflowScope].range}. sınıf kapıları aktif.`
      : `Hoş geldin ${displayName}! Giriş yapmak istediğin laboratuvar kapısını seç.`;
    let type: 'info' | 'success' | 'error' = 'info';

    if (selectedGrade !== null) {
      const count = getModulesForGrade(selectedGrade).length;
      const archiveCount = getArchivedModulesForGrade(selectedGrade).length;
      if (count === 0) {
        text = archiveCount > 0
          ? `${selectedGrade}. Sınıfta aktif yeni görev yok; ${archiveCount} eski deney arşivde tutuluyor.`
          : `${selectedGrade}. Sınıf reaktörleri şu an inşa ediliyor komutanım! Lütfen başka bir kapı dene.`;
        type = archiveCount > 0 ? 'info' : 'error';
      } else {
        text = archiveCount > 0
          ? `${selectedGrade}. Sınıf laboratuvarlarında seni ${count} aktif görev bekliyor. ${archiveCount} eski deney arşivde ayrı tutuluyor.`
          : `${selectedGrade}. Sınıf laboratuvarlarında seni ${count} aktif görev bekliyor. Tıkla ve başlat!`;
        type = 'success';
      }
    }
    
    return { id: selectedGrade || 0, text, type };
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white font-sans overflow-x-hidden relative selection:bg-[#00E5FF] selection:text-[#0B0C10]">
      {/* Arka Plan Efektleri */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00E5FF]/5 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#B388FF]/5 blur-[150px]"></div>
        <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
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
          {/* PROFILE BOARD */}
          <div className="hidden lg:flex items-center gap-4 border-r border-gray-800 pr-6 mr-2">
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{role === 'guest' ? 'Misafir Modu' : 'Astronot Kimliği'}</span>
               <span className="text-sm font-black text-white">{displayName}</span>
               <span className="text-[10px] text-[#00E5FF] font-bold mt-0.5">{masteredAtoms.length} Mühür | {masteredModules.length} Laboratuvar</span>
            </div>
            
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
              title="Profil ve Kazanımlar"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>

          {/* TOTAL PROGRESS */}
          {(() => {
            const TOTAL_MODULES = 73;
            // Geliştirme ilerlemesi: Kayıtlı olan modül sayısı
            const completedCount = activeModules.length;
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
        {scopeIsLimited && (
          <section
            data-testid="workflow-scope-banner"
            className="mb-8 flex flex-col gap-3 rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/9 px-5 py-4 shadow-[0_22px_70px_rgba(0,229,255,0.08)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#00E5FF]">çalışma hattı</p>
              <h2 className="mt-1 text-2xl font-black text-white">{workflowScopeCopy[workflowScope].label}</h2>
              <p className="mt-1 text-sm font-bold text-white/58">
                {workflowScopeCopy[workflowScope].range}. sınıf dışındaki kapılar bu sohbet için pasif.
              </p>
            </div>
          </section>
        )}

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
                    isScopeBlocked={!isGradeInWorkflowScope(grade, workflowScope)}
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

              {getArchivedModulesForGrade(selectedGrade).length > 0 && (
                <section className="mt-12 rounded-3xl border border-amber-300/15 bg-amber-300/[0.035] p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-200/70">Arşiv</p>
                      <h3 className="text-2xl font-black text-white">Eski Deneyler</h3>
                    </div>
                    <p className="max-w-xl text-sm text-gray-400">
                      Bu modüller silinmedi; yeni MEB atom ve tek ana oyuncak standardına uymadığı için aktif görev akışından ayrıldı.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {getArchivedModulesForGrade(selectedGrade).map(mod => (
                      <ArchiveModuleCard key={mod.id} mod={mod} />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PROFILE PANEL */}
      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* ASTRO-BOT (Rehber) */}
      <AstroBot message={getBotMessage()} />
    </div>
  );
}

function ArchiveModuleCard({ mod }: { mod: ModuleMeta }) {
  return (
    <Link
      to={mod.path}
      className="group relative flex flex-col rounded-3xl border border-amber-200/10 bg-black/35 p-5 opacity-80 transition-all duration-300 hover:border-amber-200/30 hover:opacity-100"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
          Legacy
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {mod.category}
        </span>
      </div>
      <h4 className="text-lg font-black text-white">{mod.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{mod.description}</p>
      {mod.archiveNote && (
        <p className="mt-4 rounded-2xl border border-amber-200/10 bg-amber-200/[0.04] p-3 text-xs leading-relaxed text-amber-100/75">
          {mod.archiveNote}
        </p>
      )}
    </Link>
  );
}


// --- ALT BİLEŞENLER ---

function GradeDoor({
  grade,
  moduleCount,
  isScopeBlocked = false,
  onClick,
}: {
  grade: number;
  moduleCount: number;
  isScopeBlocked?: boolean;
  onClick: () => void;
}) {
  const isLocked = moduleCount === 0 || isScopeBlocked;

  return (
    <motion.button 
      whileHover={{ y: -5, boxShadow: isLocked ? 'none' : '0 10px 30px rgba(0,229,255,0.15)' }}
      whileTap={{ scale: 0.96 }}
      disabled={isLocked}
      onClick={onClick}
      aria-disabled={isLocked}
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
        {isScopeBlocked ? (
          <div className="rounded-full border border-amber-200/10 bg-amber-200/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/42">
            Hat dışı
          </div>
        ) : isLocked ? (
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
  const { masteredModules } = useAtomStore();
  const completed = masteredModules.includes(mod.id);
  
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
          <div className="flex flex-col items-end gap-2">
            {mod.status === 'review-needed' && (
              <span className="text-[9px] font-black tracking-widest uppercase bg-amber-300/10 text-amber-100 px-3 py-1.5 rounded-full border border-amber-300/24">
                Görüş Gerekli
              </span>
            )}
            {mod.status === 'showcase-ready' && (
              <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-300/10 text-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300/24">
                Vitrin Hazır
              </span>
            )}
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00E5FF]/10 text-[#00E5FF] px-3 py-1.5 rounded-full border border-[#00E5FF]/20">
              {mod.category}
            </span>
          </div>
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
