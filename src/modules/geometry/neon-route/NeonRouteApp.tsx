import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Crosshair, Map, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon, Zap, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { AstroBot, BotMessage } from '../../../components/ui/AstroBot';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface Command {
  direction: Direction;
  units: number;
}

const GRID_SIZE = 12;

export default function NeonRouteApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();

  const [startPos, setStartPos] = useState<Position>({ x: 2, y: 2 });
  const [endPos, setEndPos] = useState<Position>({ x: 9, y: 8 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 2, y: 2 });
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<number>(0);

  const [gameState, setGameState] = useState<'IDLE' | 'FIRING' | 'CRASHED' | 'VICTORY'>('IDLE');
  const [pathHistory, setPathHistory] = useState<Position[]>([{ x: 2, y: 2 }]);

  const [showVictory, setShowVictory] = useState(false);
  const playbackIdRef = React.useRef<number>(0);

  // Generate random level on mount
  useEffect(() => {
    generateLevel();
  }, []);

  const generateLevel = () => {
    const sx = Math.floor(Math.random() * 4) + 1;
    const sy = Math.floor(Math.random() * 4) + 1;
    const ex = Math.floor(Math.random() * 4) + 6;
    const ey = Math.floor(Math.random() * 4) + 6;
    setStartPos({ x: sx, y: sy });
    setEndPos({ x: ex, y: ey });
    setCurrentPos({ x: sx, y: sy });
    setCommands([]);
    setPathHistory([{ x: sx, y: sy }]);
    setGameState('IDLE');
    setSelectedDirection(null);
    setSelectedUnits(0);
  };

  const visualReset = () => {
    playbackIdRef.current += 1; // İptal et
    setCurrentPos({ ...startPos });
    setPathHistory([{ ...startPos }]);
    setGameState('IDLE');
  };

  const handleAddCommand = () => {
    if (selectedDirection && selectedUnits > 0) {
      setCommands([...commands, { direction: selectedDirection, units: selectedUnits }]);
      setSelectedDirection(null);
      setSelectedUnits(0);
      visualReset();
    }
  };

  const handleRemoveCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
    visualReset();
  };

  const handleFire = async () => {
    if (commands.length === 0) return;
    setGameState('FIRING');
    
    playbackIdRef.current += 1;
    const currentPlaybackId = playbackIdRef.current;
    
    let simPos = { ...startPos };
    let newHistory = [{ ...startPos }];
    
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        
        for (let step = 0; step < cmd.units; step++) {
            if (cmd.direction === 'UP') simPos.y += 1;
            if (cmd.direction === 'DOWN') simPos.y -= 1;
            if (cmd.direction === 'RIGHT') simPos.x += 1;
            if (cmd.direction === 'LEFT') simPos.x -= 1;
            
            newHistory.push({ ...simPos });
            setCurrentPos({ ...simPos });
            setPathHistory([...newHistory]);

            // Simulate drawing time
            await new Promise(resolve => setTimeout(resolve, 200));

            // Eğer iptal edildiyse asenkron döngüden çık
            if (playbackIdRef.current !== currentPlaybackId) return;

            // Bounds check
            if (simPos.x < 0 || simPos.x > GRID_SIZE || simPos.y < 0 || simPos.y > GRID_SIZE) {
                setGameState('CRASHED');
                return;
            }
        }
    }

    if (simPos.x === endPos.x && simPos.y === endPos.y) {
        setGameState('VICTORY');
        setTimeout(() => {
            if (playbackIdRef.current !== currentPlaybackId) return;
            unlockAtom('MAT.5.3.1.2');
            unlockAtom('MAT.5.3.2.1');
            unlockModule('neon-route');
            addScore(500);
            setShowVictory(true);
        }, 1000);
    } else {
        setGameState('CRASHED');
    }
  };

  const handleReset = () => {
    setCommands([]);
    visualReset();
  };

  const getBotMessage = (): BotMessage => {
    if (gameState === 'CRASHED') return { id: 1, text: 'Lazer yörüngeden saptı komutanım! Rotayı sıfırlayıp tekrar dene.', type: 'error' };
    if (gameState === 'VICTORY') return { id: 2, text: 'Mükemmel hesaplama! Uydu bağlantısı sağlandı.', type: 'success' };
    if (gameState === 'FIRING') return { id: 3, text: 'Lazer ateşlendi! Hedefe ulaşıyor mu izleyelim...', type: 'info' };
    
    if (commands.length === 0) {
        return { id: 4, text: 'Sağdaki paneli kullanarak kırmızı start noktasından varış noktasına gidecek koordinatları gir. Önce yön, sonra miktar seç!', type: 'info' };
    }
    
    return { id: 5, text: 'Komutlar hazır olduğunda "Ateşle" butonuna tıkla.', type: 'info' };
  };

  const getDirIcon = (dir: Direction) => {
    switch (dir) {
      case 'UP': return <ArrowUp className="w-4 h-4" />;
      case 'DOWN': return <ArrowDown className="w-4 h-4" />;
      case 'LEFT': return <ArrowLeft className="w-4 h-4" />;
      case 'RIGHT': return <ArrowRightIcon className="w-4 h-4" />;
    }
  };

  const getDirTextTR = (dir: Direction) => {
    switch (dir) {
      case 'UP': return 'YUKARI';
      case 'DOWN': return 'AŞAĞI';
      case 'LEFT': return 'SOLA';
      case 'RIGHT': return 'SAĞA';
    }
  };

  return (
    <div className="h-full w-full bg-[#0B0C10] text-white flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 relative font-sans selection:bg-[#00E5FF] selection:text-black custom-scrollbar">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#00E5FF]/5 blur-[120px]"></div>
        <div className="absolute top-[60%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#B388FF]/10 blur-[100px]"></div>
      </div>

      <header className="max-w-7xl w-full mx-auto flex items-center justify-between relative z-20 mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-2xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group">
            <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Map className="w-6 h-6 text-[#00E5FF]" /> NEON ROTA <span className="text-[#00E5FF]">TERMINALI</span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Nokta Koordinatı & Doğru Parçası</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-20 flex-1 pb-40">
        
        {/* Sol Panel: Grid Alanı (Coordinate Graph) */}
        <div className="lg:col-span-8 bg-[#12121A] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[600px] select-none">
          
          <div className="relative w-full max-w-[500px] aspect-square rounded-xl border-2 border-gray-800/80 bg-[#0B0C10]">
              {/* Grid Lines */}
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-0">
                  <defs>
                      <pattern id="grid" width={`${100 / GRID_SIZE}%`} height={`${100 / GRID_SIZE}%`} patternUnits="userSpaceOnUse">
                          <path d={`M ${500/GRID_SIZE} 0 L 0 0 0 ${500/GRID_SIZE}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                      </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Grid Axis Labels (Optional: adding coordinate text helpers) */}
              <div className="absolute -left-6 bottom-0 top-0 flex flex-col-reverse justify-between text-[10px] text-gray-600 font-mono py-2">
                  {Array.from({length: GRID_SIZE + 1}).map((_, i) => <span key={i}>{i}</span>)}
              </div>
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-gray-600 font-mono px-2">
                  {Array.from({length: GRID_SIZE + 1}).map((_, i) => <span key={i}>{i}</span>)}
              </div>

              {/* Interactive Path / Start / End SVG Layer */}
              <svg 
                  viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} 
                  className="absolute inset-0 w-full h-full z-10 overflow-visible"
                  style={{ transform: 'scaleY(-1)' }} // Invert Y axis so (0,0) is bottom-left
              >
                  {/* Start Node */}
                  <circle cx={startPos.x} cy={startPos.y} r={0.3} fill="#00E5FF" opacity="0.4" />
                  <circle cx={startPos.x} cy={startPos.y} r={0.15} fill="#00E5FF" />
                  
                  {/* End/Target Node */}
                  <circle cx={endPos.x} cy={endPos.y} r={0.4} fill="none" stroke="#B388FF" strokeWidth="0.05" strokeDasharray="0.1 0.1" className="animate-pulse" />
                  <circle cx={endPos.x} cy={endPos.y} r={0.15} fill="#B388FF" className="animate-pulse" />
                  
                  {/* Path History */}
                  <polyline 
                      points={pathHistory.map(p => `${p.x},${p.y}`).join(' ')} 
                      fill="none" 
                      stroke="#00E5FF" 
                      strokeWidth="0.1" 
                      strokeLinecap="round"
                      strokeLinejoin="round" 
                      className="filter drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                      style={{ transition: 'all 0.2s ease-in-out' }}
                  />

                  {/* Current Moving Head */}
                  <motion.circle 
                      cx={currentPos.x} 
                      cy={currentPos.y} 
                      r={0.2} 
                      fill="white"
                      animate={{ cx: currentPos.x, cy: currentPos.y }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="filter drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                  />
              </svg>
              
              {gameState === 'CRASHED' && (
                  <div className="absolute inset-0 bg-red-500/10 z-20 flex items-center justify-center animate-pulse rounded-xl">
                      <span className="text-red-500 font-bold bg-black/80 px-4 py-2 rounded-lg border border-red-500/50 uppercase tracking-widest text-sm">
                          Hata Saptandı / Rota İptal
                      </span>
                  </div>
              )}
          </div>
        </div>

        {/* Sağ Panel: Kontrol Konsolu */}
        <div className="lg:col-span-4 bg-[#12121A] border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 bg-[#1F2833]/50 border-b border-gray-800 flex items-center gap-3">
            <Navigation className="w-5 h-5 text-[#B388FF]" />
            <h3 className="font-bold text-white tracking-widest uppercase text-sm">Yörünge Kodlayıcı</h3>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* Yön D-Pad */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">1. Yön Seçimi</span>
              <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                <div></div>
                <button 
                  onClick={() => setSelectedDirection('UP')}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedDirection === 'UP' ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-gray-900 border border-gray-800 hover:border-gray-500 text-gray-400'}`}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div></div>
                <button 
                  onClick={() => setSelectedDirection('LEFT')}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedDirection === 'LEFT' ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-gray-900 border border-gray-800 hover:border-gray-500 text-gray-400'}`}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-center bg-gray-950 rounded-xl border border-gray-900">
                    <Crosshair className="w-4 h-4 text-gray-700" />
                </div>
                <button 
                  onClick={() => setSelectedDirection('RIGHT')}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedDirection === 'RIGHT' ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-gray-900 border border-gray-800 hover:border-gray-500 text-gray-400'}`}
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </button>
                <div></div>
                <button 
                  onClick={() => setSelectedDirection('DOWN')}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedDirection === 'DOWN' ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-gray-900 border border-gray-800 hover:border-gray-500 text-gray-400'}`}
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Miktar */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">2. Birim (Kare)</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setSelectedUnits(num)}
                    className={`flex-1 py-3 rounded-xl font-bold font-mono transition-all ${selectedUnits === num ? 'bg-[#B388FF] text-black shadow-[0_0_15px_rgba(179,136,255,0.5)]' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Komutu Ekle */}
            <button 
              onClick={handleAddCommand}
              disabled={!selectedDirection || selectedUnits === 0 || gameState === 'FIRING'}
              className="w-full py-4 rounded-xl font-black uppercase tracking-wider text-sm border-2 border-dashed border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
            >
              KOD LİSTESİNE EKLE +
            </button>

            {/* Eklenen Komutlar Listesi */}
            <div className="flex-1 bg-black/50 rounded-xl overflow-y-auto p-4 border border-gray-900 custom-scrollbar max-h-[150px]">
                {commands.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-600 text-xs font-mono uppercase text-center opacity-50">
                        {'>'} Bekleniyor... Yön ve birim girin
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {commands.map((cmd, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#1F2833] py-2 px-3 rounded-lg border border-gray-700">
                                <div className="flex items-center gap-2 font-mono text-xs text-[#00E5FF]">
                                    {getDirIcon(cmd.direction)}
                                    <span className="text-white px-2 pr-4">{getDirTextTR(cmd.direction)}</span>
                                    <span className="bg-[#B388FF]/20 text-[#B388FF] px-2 py-0.5 rounded">{cmd.units} BR</span>
                                </div>
                                <button 
                                    onClick={() => handleRemoveCommand(idx)}
                                    disabled={gameState === 'FIRING'}
                                    className="text-gray-500 hover:text-red-500 disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                 <button 
                  onClick={handleReset}
                  className="px-4 py-4 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-400 font-bold"
                  title="Sıfırla"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleFire}
                  disabled={commands.length === 0 || gameState === 'FIRING'}
                  className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#B388FF] text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(179,136,255,0.4)] disabled:opacity-50"
                >
                  <Zap className="w-5 h-5 fill-current" /> ATEŞLE
                </button>
            </div>
          </div>
        </div>
      </main>

      {/* Astro Bot */}
      <AstroBot message={getBotMessage()} />

      {/* Başarı Ekranı (Modal) */}
      <AnimatePresence>
        {showVictory && (
           <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
         >
           <motion.div 
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             className="bg-[#12121A] border border-[#00E5FF]/30 p-10 rounded-[3rem] max-w-2xl w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,229,255,0.2)]"
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00E5FF]/20 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="w-24 h-24 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00E5FF]/20">
               <Map className="w-12 h-12 text-[#00E5FF]" />
             </div>
             
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
               ROTA <span className="text-[#00E5FF]">HESAPLANDI!</span>
             </h2>
             <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                Konum kodlarını doğru parçalarına dönüştürdün ve uydu bağlantısını kusursuz sağladın! 
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                {/* Görev Kazanımları */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#1F2833] border border-[#00FF88]/30 p-6 rounded-3xl relative overflow-hidden group">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-[#00FF88]" />
                      <span className="font-mono text-[#00FF88] font-bold text-xs">MAT.5.3.1.2</span>
                   </div>
                   <p className="text-white text-sm leading-relaxed">Sanal araçla doğru parçası çizimi kanıtlandı.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#1F2833] border border-[#00E5FF]/30 p-6 rounded-3xl relative overflow-hidden group">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                      <span className="font-mono text-[#00E5FF] font-bold text-xs">MAT.5.3.2.1</span>
                   </div>
                   <p className="text-white text-sm leading-relaxed">Konumun yön ve birimle tespiti algılandı.</p>
                </motion.div>
             </div>

             <div className="flex gap-4 max-w-sm mx-auto">
               <button 
                 onClick={() => {
                   setShowVictory(false);
                   generateLevel();
                 }}
                 className="flex-1 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl border border-gray-700 transition-colors"
               >
                 YENİ ROTA
               </button>
               <Link 
                 to="/"
                 className="flex-[2] px-6 py-4 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors"
               >
                 KÖPRÜYE DÖN <ArrowRight className="w-5 h-5" />
               </Link>
             </div>

           </motion.div>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
