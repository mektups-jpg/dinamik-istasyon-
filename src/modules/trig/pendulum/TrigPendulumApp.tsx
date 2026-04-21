import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, FastForward, Activity, Settings2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import AstroGuide, { AstroMood } from '../../../components/AstroGuide';

const CIRCLE_RADIUS = 100;
const WAVE_SPEED = 2; // pixel shifting speed
const MAX_POINTS = 300;

export default function TrigPendulumApp() {
  const navigate = useNavigate();
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMult, setSpeedMult] = useState(1);
  const [mode, setMode] = useState<'sin' | 'cos'>('sin');
  
  // Animation state (kept in refs to avoid re-renders on 60fps loop, we'll manually update a canvas or svg, but for React reactivity bounded to 60fps, we can use a small state tick or use canvas. Let's use Canvas to avoid DOM overload with polyline arrays.)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number | null>(null);
  
  const thetaRef = useRef(0);
  const waveRef = useRef<number[]>([]);

  const [guideConfig, setGuideConfig] = useState<{ visible: boolean; message: string; mood: AstroMood }>({
    visible: true,
    message: "Lise Kademesi: Trigonometri! Sol taraftaki Birim Çember radarı döndükçe, y-eksenindeki izdüşümünün (Sinüs) zaman grafiğinde nasıl mükemmel bir dalga çizdiğine tanık olacaksın.",
    mood: 'idle'
  });

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      return;
    }

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Update theta
      thetaRef.current += 0.02 * speedMult;
      if (thetaRef.current >= Math.PI * 2 * 10 && !completed) {
        // give an achievement after 10 loops
        setCompleted(true);
        unlockAtom("G11.TRG.010.1");
        unlockAtom("G11.TRG.010.2");
        addScore(200);
      }

      // Calculate current value based on mode
      const currentVal = mode === 'sin' 
        ? Math.sin(thetaRef.current) 
        : Math.cos(thetaRef.current);

      // Add to beginning of wave array
      waveRef.current.unshift(currentVal);
      if (waveRef.current.length > MAX_POINTS) {
        waveRef.current.pop();
      }

      // CLEAR CANVAS
      ctx.clearRect(0, 0, width, height);

      // Setup styles
      ctx.lineWidth = 2;
      const cx = 150;
      const cy = height / 2;

      // --- DRAW UNIT CIRCLE ---
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
      ctx.arc(cx, cy, CIRCLE_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw Axes for Circle
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.moveTo(cx - CIRCLE_RADIUS - 20, cy);
      ctx.lineTo(cx + CIRCLE_RADIUS + 20, cy);
      ctx.moveTo(cx, cy - CIRCLE_RADIUS - 20);
      ctx.lineTo(cx, cy + CIRCLE_RADIUS + 20);
      ctx.stroke();

      // Dot position
      const dotX = cx + Math.cos(thetaRef.current) * CIRCLE_RADIUS;
      const dotY = cy - Math.sin(thetaRef.current) * CIRCLE_RADIUS; // Negative because Canvas Y goes down

      // Radius line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
      ctx.moveTo(cx, cy);
      ctx.lineTo(dotX, dotY);
      ctx.stroke();

      // The Rotating Dot
      ctx.beginPath();
      ctx.fillStyle = "#00E5FF";
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00E5FF";
      ctx.fill(); // double fill for shadow glow
      ctx.shadowBlur = 0; // reset

      // --- DRAW PROJECTION LINE ---
      const waveStartX = 320;
      
      // Where does the projection come from depending on sin/cos?
      // For Sine: projecting the Y position horizontally.
      // For Cosine: projecting the X position (we can project it horizontally too to draw the wave, but physically it's from the X axis. We will just draw a horizontal projection for both for clarity of the wave generator, but visually map it).
      
      const projectionY = mode === 'sin' ? dotY : cy - Math.cos(thetaRef.current) * CIRCLE_RADIUS;
      
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.setLineDash([5, 5]);
      
      if (mode === 'sin') {
          // Horizontal projection from the dot for Sine
          ctx.moveTo(dotX, dotY);
          ctx.lineTo(waveStartX, dotY);
      } else {
          // For Cosine, vertical projection from dot to axis, then horizontal
          ctx.moveTo(dotX, dotY);
          ctx.lineTo(dotX, cy); // down to x-axis
          // Then just a direct line from that logical mapping to the wave start (simplified)
          ctx.moveTo(cx + Math.cos(thetaRef.current) * CIRCLE_RADIUS, cy);
          ctx.lineTo(waveStartX, projectionY);
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // --- DRAW WAVE OSCILLOSCOPE ---
      // Wave axis
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.moveTo(waveStartX, cy);
      ctx.lineTo(width - 20, cy);
      ctx.stroke();

      // The Wave
      const waveColor = mode === 'sin' ? "#FF00FF" : "#10B981"; // Purple for Sin, Green for Cos
      ctx.beginPath();
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 3;

      for (let i = 0; i < waveRef.current.length; i++) {
        const val = waveRef.current[i];
        const xPos = waveStartX + i * WAVE_SPEED * 1.5;
        const yPos = cy - val * CIRCLE_RADIUS;
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.stroke();

      // Wave head glowing dot
      if (waveRef.current.length > 0) {
        ctx.beginPath();
        ctx.fillStyle = waveColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = waveColor;
        ctx.arc(waveStartX, cy - waveRef.current[0] * CIRCLE_RADIUS, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- DRAW PENDULUM (Harmonic Motion) ---
      // Draw a pendulum swinging at the top middle of the screen synced with the wave
      const pendCx = width / 2;
      const pendCy = 30; // pivot
      const pendLength = 60;
      // Map currentVal (-1 to 1) to an angle for the pendulum (-pi/4 to pi/4)
      const pendAngle = currentVal * (Math.PI / 4);
      const bobX = pendCx + Math.sin(pendAngle) * pendLength;
      const bobY = pendCy + Math.cos(pendAngle) * pendLength;

      // Pivot
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.arc(pendCx, pendCy, 4, 0, Math.PI * 2);
      ctx.fill();

      // String
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.moveTo(pendCx, pendCy);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      ctx.beginPath();
      ctx.fillStyle = waveColor;
      ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
      ctx.fill();

      // --- TEXT HUD ON CANVAS ---
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px monospace";
      ctx.fillText(`Açı (θ): ${(thetaRef.current % (Math.PI * 2)).toFixed(2)} radyan`, 30, 40);
      ctx.fillText(`${mode === 'sin' ? 'Sinüs' : 'Kosinüs'} Değeri: ${currentVal.toFixed(2)}`, 30, 60);

      reqRef.current = requestAnimationFrame(draw);
    };

    reqRef.current = requestAnimationFrame(draw);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, speedMult, mode, completed, unlockAtom, addScore]);

  // Initial draw so it's not totally empty
  useEffect(() => {
    if (!isPlaying && thetaRef.current === 0) {
      // Just toggle play briefly or draw static frame
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 50);
    }
  }, []);

  const handleReset = () => {
    thetaRef.current = 0;
    waveRef.current = [];
    if (!isPlaying) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.1),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
      
      <header className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center justify-between relative z-30">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
            <h1 className="text-xl font-medium tracking-tight text-[#00E5FF]">Trigonometrik Sarkaç</h1>
            <p className="text-xs text-[#00E5FF]/60 mt-1 uppercase tracking-widest">SİSTEM: HARMONİK LİSE // TRG_11</p>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 relative z-20 max-w-7xl mx-auto w-full">
        
        {/* Controls HUD */}
        <div className="flex flex-col md:flex-row gap-4 w-full bg-[#111]/80 border border-[#00E5FF]/20 p-4 rounded-2xl backdrop-blur-md shadow-2xl items-center justify-between">
            <div className="flex items-center gap-3 bg-black/50 p-2 rounded-xl border border-gray-800">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-transform hover:scale-105 active:scale-95 ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]'}`}
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <button 
                  onClick={handleReset}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 bg-black/50 px-6 py-3 rounded-xl border border-gray-800">
                <Settings2 className="w-5 h-5 text-gray-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase">Motor Hızı</span>
                    <input 
                        type="range" min="0.5" max="3" step="0.5" value={speedMult}
                        onChange={(e) => setSpeedMult(parseFloat(e.target.value))}
                        className="w-32 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                    />
                </div>
                <span className="text-xs text-[#00E5FF] font-mono min-w-[3ch]">{speedMult}x</span>
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-gray-800">
                <button 
                    onClick={() => { setMode('sin'); handleReset(); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest transition-colors ${mode === 'sin' ? 'bg-[#FF00FF]/20 text-[#FF00FF] border border-[#FF00FF]/50 shadow-[0_0_15px_rgba(255,0,255,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    SİNÜS
                </button>
                <button 
                    onClick={() => { setMode('cos'); handleReset(); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest transition-colors ${mode === 'cos' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    KOSİNÜS
                </button>
            </div>
        </div>

        {/* The Physics Canvas */}
        <div className="flex-1 w-full bg-[#05050A] rounded-3xl border border-gray-800 relative flex items-center justify-center p-2 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            
            <canvas 
                ref={canvasRef} 
                width={1000} 
                height={500} 
                className="w-full h-full object-contain max-w-full"
            />

            {/* Achievement Toast */}
            <AnimatePresence>
                {completed && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-10 bg-green-900/40 border border-green-500 text-green-300 p-4 rounded-2xl backdrop-blur-xl flex items-center gap-4 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                    >
                        <Activity className="w-8 h-8 text-green-400" />
                        <div>
                            <h4 className="font-bold text-sm">Harmonik Model Çözümlendi!</h4>
                            <p className="text-[10px] text-green-400/80">Trigonometri ve Dalga modeli veri tabanına eklendi.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </main>

      <AstroGuide 
        visible={guideConfig.visible}
        message={guideConfig.message}
        mood={guideConfig.mood}
        onClose={() => setGuideConfig(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
