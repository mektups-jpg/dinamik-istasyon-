import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Slider } from '../../../components/ui/slider';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { useGameStore } from '../../../store/useGameStore';
import { Trophy, Info, CheckCircle2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import useSound from 'use-sound';

// We'll use a simple beep sound URL for demonstration
const BEEP_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const SUCCESS_URL = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';

const SPECIAL_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

export default function UnitCircleApp() {
  const [angle, setAngle] = useState(45);
  const [discoveredAngles, setDiscoveredAngles] = useState<number[]>([]);
  
  const { score, addScore, soundEnabled } = useGameStore();
  
  const [playBeep] = useSound(BEEP_URL, { volume: 0.5, soundEnabled });
  const [playSuccess] = useSound(SUCCESS_URL, { volume: 0.7, soundEnabled });

  // Calculate coordinates
  const radius = 150;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = -Math.sin(rad) * radius; // Negative because SVG y-axis goes down

  // Handle angle change
  const handleAngleChange = (val: number | readonly number[]) => {
    const newAngle = Array.isArray(val) ? val[0] : (val as number);
    setAngle(newAngle);
    
    // Gamification: Discover special angles
    if (SPECIAL_ANGLES.includes(newAngle) && !discoveredAngles.includes(newAngle)) {
      setDiscoveredAngles(prev => [...prev, newAngle]);
      addScore(50);
      if (newAngle % 90 === 0) {
        playSuccess();
      } else {
        playBeep();
      }
    }
  };

  const sinVal = Math.sin(rad).toFixed(2);
  const cosVal = Math.cos(rad).toFixed(2);
  const tanVal = Math.abs(Math.cos(rad)) < 0.01 ? '\\infty' : Math.tan(rad).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0B0C10] text-white font-sans overflow-hidden">
      
      {/* LEFT PANEL - SIMULATION */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8">
        
        {/* Gamification Header */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <Badge variant="outline" className="bg-[#1F2833] text-[#00E5FF] border-[#00E5FF]/30 px-4 py-1.5 text-sm">
            <Trophy className="w-4 h-4 mr-2 text-[#FFD700]" />
            {score} Puan
          </Badge>
          <div className="text-xs text-gray-400">
            Keşfedilen Özel Açılar: <span className="text-white font-bold">{discoveredAngles.length} / {SPECIAL_ANGLES.length}</span>
          </div>
        </div>

        {/* SVG Unit Circle */}
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          <svg width="400" height="400" viewBox="-200 -200 400 400" className="overflow-visible">
            {/* Grid Lines */}
            <line x1="-200" y1="0" x2="200" y2="0" stroke="#1F2833" strokeWidth="2" />
            <line x1="0" y1="-200" x2="0" y2="200" stroke="#1F2833" strokeWidth="2" />
            
            {/* Main Circle */}
            <circle cx="0" cy="0" r={radius} fill="none" stroke="#45A29E" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Angle Arc */}
            <path 
              d={`M 30 0 A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${Math.cos(rad) * 30} ${-Math.sin(rad) * 30}`} 
              fill="none" 
              stroke="#FF6B00" 
              strokeWidth="3" 
            />
            
            {/* Cosine Line (X-axis) */}
            <motion.line 
              x1="0" y1="0" 
              animate={{ x2: x, y2: 0 }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              stroke="#00E5FF" strokeWidth="4" 
            />
            
            {/* Sine Line (Y-axis) */}
            <motion.line 
              animate={{ x1: x, y1: 0, x2: x, y2: y }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              stroke="#FF4444" strokeWidth="4" 
            />
            
            {/* Radius Line (Hypotenuse) */}
            <motion.line 
              x1="0" y1="0" 
              animate={{ x2: x, y2: y }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              stroke="#FFFFFF" strokeWidth="3" 
            />
            
            {/* Point */}
            <motion.circle 
              animate={{ cx: x, cy: y }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              r="6" fill="#FF6B00" 
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md mt-12 bg-[#1F2833] p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="flex justify-between mb-4">
            <span className="text-gray-400 font-medium">Açı (Derece)</span>
            <span className="text-[#00E5FF] font-bold text-xl">{angle}°</span>
          </div>
          <Slider 
            defaultValue={[45]} 
            max={360} 
            step={1} 
            value={[angle]}
            onValueChange={handleAngleChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[400px] bg-[#121212] border-l border-gray-800 p-8 flex flex-col gap-6 overflow-y-auto">
        
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Birim Çember</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Yarıçapı 1 birim olan çembere birim çember denir. Birim çember üzerindeki bir noktanın koordinatları, o açının trigonometrik değerlerini verir.
          </p>
        </div>

        <Card className="bg-[#1F2833] border-gray-800 p-5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Anlık Değerler</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0B0C10] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF4444]"></div>
                <span className="text-gray-300 font-medium">Sinüs (Y Ekseni)</span>
              </div>
              <div className="text-lg font-bold text-white">
                <InlineMath math={`\\sin(${angle}^\\circ) = ${sinVal}`} />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0B0C10] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00E5FF]"></div>
                <span className="text-gray-300 font-medium">Kosinüs (X Ekseni)</span>
              </div>
              <div className="text-lg font-bold text-white">
                <InlineMath math={`\\cos(${angle}^\\circ) = ${cosVal}`} />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0B0C10] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B00]"></div>
                <span className="text-gray-300 font-medium">Tanjant (Sin/Cos)</span>
              </div>
              <div className="text-lg font-bold text-white">
                <InlineMath math={`\\tan(${angle}^\\circ) = ${tanVal}`} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#00E5FF]/5 border-[#00E5FF]/20 p-5 mt-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00E5FF] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#00E5FF] font-bold text-sm mb-1">Görev</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Kaydırıcıyı kullanarak tüm "Özel Açıları" (30°, 45°, 60°, 90° vb.) bulun ve ekstra puanlar kazanın!
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
