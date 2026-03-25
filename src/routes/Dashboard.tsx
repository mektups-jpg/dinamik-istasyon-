import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../registry/moduleRegistry';
import { 
  Play, LayoutGrid, Trophy, Flame, Star, 
  BookOpen, Compass, BarChart2, Settings, 
  ChevronRight, Lock, CheckCircle2
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function Dashboard() {
  const { score } = useGameStore();
  const [activeTab, setActiveTab] = useState('all'); // all, primary, middle, high

  // K-12 Kategorizasyonu (Örnekleme)
  const filteredModules = modules.filter(mod => {
    if (activeTab === 'all') return true;
    if (activeTab === 'primary' && mod.category.includes('İlkokul')) return true;
    if (activeTab === 'middle' && mod.category.includes('Ortaokul')) return true;
    if (activeTab === 'high' && (mod.category.includes('Lise') || mod.category.includes('Geometri') || mod.category.includes('Olasılık'))) return true;
    return false;
  });

  return (
    <div className="flex h-screen bg-[#0B0C10] text-white font-sans overflow-hidden">
      
      {/* SOL SİDEBAR (Navigation) */}
      <aside className="w-64 bg-[#121212] border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#B388FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <LayoutGrid className="w-6 h-6 text-[#0B0C10]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">MathVerse</h1>
            <p className="text-[10px] text-[#00E5FF] font-semibold tracking-wider uppercase">K-12 Akademi</p>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Ana Menü */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Menü</p>
            <nav className="space-y-1">
              <NavItem icon={<Compass />} label="Keşfet" active />
              <NavItem icon={<BookOpen />} label="Öğrenme Yolu" />
              <NavItem icon={<Trophy />} label="Liderlik Tablosu" />
              <NavItem icon={<BarChart2 />} label="İstatistikler" />
            </nav>
          </div>

          {/* Sınıf Seviyeleri */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Seviyeler</p>
            <nav className="space-y-1">
              <FilterItem 
                label="Tüm Modüller" 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')} 
              />
              <FilterItem 
                label="İlkokul (1-4)" 
                active={activeTab === 'primary'} 
                onClick={() => setActiveTab('primary')} 
                color="text-green-400"
              />
              <FilterItem 
                label="Ortaokul (5-8)" 
                active={activeTab === 'middle'} 
                onClick={() => setActiveTab('middle')} 
                color="text-yellow-400"
              />
              <FilterItem 
                label="Lise (9-12)" 
                active={activeTab === 'high'} 
                onClick={() => setActiveTab('high')} 
                color="text-purple-400"
              />
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <NavItem icon={<Settings />} label="Ayarlar" />
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Üst Bar (Top Bar) - Oyunlaştırma Metrikleri */}
        <header className="h-20 border-b border-gray-800 bg-[#0B0C10]/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-bold text-white">Hoş Geldin, Öğrenci 👋</h2>
          
          <div className="flex items-center gap-6">
            {/* Streak (Ateş) */}
            <div className="flex items-center gap-2 bg-[#1F2833] px-4 py-2 rounded-full border border-gray-800">
              <Flame className="w-5 h-5 text-[#FF6B00]" />
              <span className="font-bold text-white">3 Gün</span>
            </div>
            
            {/* Global Puan */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#00E5FF]/10 to-[#B388FF]/10 px-4 py-2 rounded-full border border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
              <Star className="w-5 h-5 text-[#00E5FF] fill-[#00E5FF]" />
              <span className="font-bold text-[#00E5FF]">{score} XP</span>
            </div>

            {/* Profil Avatarı */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border-2 border-[#1F2833] cursor-pointer" />
          </div>
        </header>

        {/* Scrollable İçerik */}
        <div className="flex-1 overflow-y-auto p-8 pb-24">
          
          {/* Hero Section: Sıradaki Görev */}
          <section className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F2833] to-[#121212] border border-gray-800 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
              {/* Arka plan efekti */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00E5FF] opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold rounded-full uppercase tracking-wider">
                    Sıradaki Görev
                  </span>
                  <span className="text-gray-400 text-sm">Lise • Geometri</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Trigonometrik Birim Çemberi Keşfet
                </h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Sinüs ve kosinüsün sadece ezberlenecek formüller değil, dönen bir çemberin gölgeleri olduğunu kendi gözlerinle gör.
                </p>
                <Link 
                  to="/unit-circle" 
                  className="inline-flex items-center justify-center gap-2 bg-[#00E5FF] hover:bg-[#66FCF1] text-[#0B0C10] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Laboratuvara Gir
                </Link>
              </div>

              {/* Hero Görseli (Placeholder) */}
              <div className="relative z-10 w-full md:w-auto flex-shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-dashed border-gray-700 flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                  <div className="absolute w-full h-[2px] bg-gray-700"></div>
                  <div className="absolute h-full w-[2px] bg-gray-700"></div>
                  <div className="w-4 h-4 rounded-full bg-[#00E5FF] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#00E5FF]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Modül Grid (Bento Box Layout) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Eğitim Modülleri</h3>
              <div className="text-sm text-gray-400">{filteredModules.length} Modül Bulundu</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModules.map((mod) => (
                <ModuleCard key={mod.id} mod={mod} />
              ))}

              {/* Gelecek Modüller İçin Placeholder (Kilitli) */}
              {activeTab === 'primary' && (
                <LockedModuleCard title="Kesirler Laboratuvarı" category="İlkokul" />
              )}
              {activeTab === 'middle' && (
                <LockedModuleCard title="Pisagor Su Simülasyonu" category="Ortaokul" />
              )}
              {activeTab === 'high' && (
                <LockedModuleCard title="İkinci Dereceden Denklemler" category="Lise" />
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-[#1F2833] text-white font-medium' 
        : 'text-gray-400 hover:bg-[#1F2833]/50 hover:text-gray-200'
    }`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5 ${active ? 'text-[#00E5FF]' : ''}` })}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function FilterItem({ label, active, onClick, color = "text-gray-400" }: { label: string, active: boolean, onClick: () => void, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-[#1F2833] text-white font-medium' 
          : 'text-gray-400 hover:bg-[#1F2833]/50 hover:text-gray-200'
      }`}
    >
      <span className="text-sm">{label}</span>
      {active && <ChevronRight className={`w-4 h-4 ${color}`} />}
    </button>
  );
}

function ModuleCard({ mod }: { mod: any }) {
  const isCompleted = mod.id === 'unit-circle'; // Örnek: Birim çember tamamlanmış gibi gösterelim
  
  return (
    <Link 
      to={mod.path} 
      className="group flex flex-col bg-[#121212] rounded-2xl border border-gray-800 overflow-hidden hover:border-[#00E5FF]/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,229,255,0.15)]"
    >
      {/* Thumbnail Area */}
      <div className="h-40 relative bg-[#1F2833] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <LayoutGrid className="w-12 h-12 text-gray-700 group-hover:text-[#00E5FF]/50 transition-colors duration-500 group-hover:scale-110" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isCompleted ? (
            <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full backdrop-blur-md border border-green-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="bg-black/40 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              Başla
            </div>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
            {mod.category}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
            mod.difficulty === 'Kolay' ? 'bg-green-500/10 text-green-400' :
            mod.difficulty === 'Orta' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {mod.difficulty}
          </span>
        </div>
        
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">{mod.title}</h4>
        <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{mod.description}</p>
        
        {/* Progress Bar (Örnek) */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
            <span>İlerleme</span>
            <span>{isCompleted ? '100%' : '0%'}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500 w-full' : 'bg-[#00E5FF] w-0 group-hover:w-[10%]'}`}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LockedModuleCard({ title, category }: { title: string, category: string }) {
  return (
    <div className="flex flex-col bg-[#121212]/50 rounded-2xl border border-gray-800/50 overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all">
      <div className="h-40 relative bg-[#1F2833]/50 flex items-center justify-center">
        <Lock className="w-10 h-10 text-gray-600" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          {category}
        </span>
        <h4 className="text-lg font-bold text-gray-400 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-6">Bu modül henüz kilitli. Önceki seviyeleri tamamlayarak kilidini açabilirsin.</p>
        <div className="mt-auto pt-4 border-t border-gray-800/50">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Yakında Eklenecek
          </span>
        </div>
      </div>
    </div>
  );
}
