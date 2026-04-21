import React, { useState, useEffect } from 'react';
import { Droplet, RefreshCcw } from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { GameHeader } from '../../../components/ui/GameHeader';
import { SciFiButton } from '../../../components/ui/SciFiButton';

// Yüksek yoğunluklu sıvı damlacıkları (Su akışını / Şelale etkisini simüle etmek için)
const DROPLETS = Array.from({ length: 120 }).map((_, i) => {
   // Damlacıkları P1(-150, 0) ile P2(150, 0) arasındaki tüm hipotenüs yüzeyine dağıtıyoruz
   const x = (Math.random() * 300) - 150;
   
   // Matematiksel olarak damlanın düşmeye başlayacağı Y ekseni (P1-P3 ve P3-P2 doğruları)
   // İkizkenar dik üçgen olduğu için doğru denklemi mutlak değerle çok basit: y = |x| - 150
   const mathY = Math.abs(x) - 150; 
   
   return {
       id: i,
       x: x + (Math.random() * 8 - 4), // Çizgisel doğallık için hafif sapmalar
       startY: mathY + (Math.random() * 10 - 5),
       delay: Math.random() * 1.5,
       duration: 0.4 + Math.random() * 0.4,
       size: 3 + Math.random() * 6
   };
});

// C Karesine dolarken yukarı doğru çıkacak hava baloncukları
const BUBBLES = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: (Math.random() * 260) - 130, 
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 2,
    size: 2 + Math.random() * 4
}));

export default function PythagorasApp() {
  const { unlockAtom } = useAtomStore();
  const { addScore } = useGameStore();

  const [isDraining, setIsDraining] = useState(false);
  const [progress, setProgress] = useState(0); 

  // Animasyonun kalbini oluşturan Framer Motion Değeri (0: A ve B tam dolu, 1: C tam dolu)
  const p = useMotionValue(0);

  // Vektörel çokgen koordinatları
  const [polyA, setPolyA] = useState("");
  const [polyB, setPolyB] = useState("");
  const [polyC, setPolyC] = useState("");

  // KUSURSUZ MERKEZLENMİŞ GEOMETRİ (İkizkenar Dik Üçgen a=b)
  // c=300 birim. Zemin yatayda mükemmel ortalanmıştır.
  const P1 = {x: -150, y: 0};
  const P2 = {x: 150, y: 0};
  const P3 = {x: 0, y: -150};
  
  const OB1 = {x: -300, y: -150};
  const OB3 = {x: -150, y: -300};
  
  const OA3 = {x: 150, y: -300};
  const OA2 = {x: 300, y: -150};
  
  const OC1 = {x: -150, y: 300};
  const OC2 = {x: 150, y: 300};

  // SVG Çerçeveleri (Boş Cam Görünümü)
  const outlineB = `${P1.x},${P1.y} ${P3.x},${P3.y} ${OB3.x},${OB3.y} ${OB1.x},${OB1.y}`;
  const outlineA = `${P3.x},${P3.y} ${OA3.x},${OA3.y} ${OA2.x},${OA2.y} ${P2.x},${P2.y}`;
  const outlineC = `${P1.x},${P1.y} ${P2.x},${P2.y} ${OC2.x},${OC2.y} ${OC1.x},${OC1.y}`;
  const outlineTri = `${P1.x},${P1.y} ${P3.x},${P3.y} ${P2.x},${P2.y}`;

  useEffect(() => {
    // Karelerin doluluk oranını (hacmini) hesaplayan vektörel motor
    const unsubscribe = p.on("change", (v) => {
      // B Karesi sıvı hacmi
      const hb = 150 * (1 - v); 
      const ltB_x = P1.x - hb;
      const ltB_y = P1.y - hb;
      const rtB_x = P3.x - hb;
      const rtB_y = P3.y - hb;
      setPolyB(`${P1.x},${P1.y} ${P3.x},${P3.y} ${rtB_x},${rtB_y} ${ltB_x},${ltB_y}`);

      // A Karesi sıvı hacmi
      const ha = 150 * (1 - v);
      const ltA_x = P3.x + ha;
      const ltA_y = P3.y - ha;
      const rtA_x = P2.x + ha;
      const rtA_y = P2.y - ha;
      setPolyA(`${P3.x},${P3.y} ${P2.x},${P2.y} ${rtA_x},${rtA_y} ${ltA_x},${ltA_y}`);

      // C Karesi sıvı hacmi (Aşağıdan yukarıya dolum)
      const hc = 300 * v; 
      const ltC_y = OC1.y - hc; // Sol üst su yüzeyi
      const rtC_y = OC2.y - hc; // Sağ üst su yüzeyi
      setPolyC(`${OC1.x},${OC1.y} ${OC2.x},${OC2.y} ${P2.x},${rtC_y} ${P1.x},${ltC_y}`);
    });
    return () => unsubscribe();
  }, [p]);

  useEffect(() => {
    p.set(0); 
  }, [p]);

  useEffect(() => {
    if (progress >= 100) {
      unlockAtom("G8.GEO.020.1"); 
      addScore(50);
    }
  }, [progress, unlockAtom, addScore]);

  const handleDrain = () => {
    if (isDraining) return;
    setIsDraining(true);
    
    // Mükemmel pürüzsüzlükte sıvı akış animasyonu
    animate(p, 1, {
      duration: 7, 
      ease: [0.42, 0, 0.58, 1], // Gerçekçi süzülme fiziği için özel ease-in-out eğrisi
      onUpdate: (latest) => {
        setProgress(Math.floor(latest * 100));
      }
    });
  };

  const handleReset = () => {
    setIsDraining(false);
    setProgress(0);
    p.set(0);
  };

  return (
    <div className="min-h-screen bg-[#020208] text-white font-sans flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Estetik Işıklandırma Arka Planı */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020208] to-[#020208]" />
      
      <GameHeader 
        title="Pisagor Su İspatı" 
        subtitle="Simetrik Hacim Modülü V2"
        rightContent={
          <>
            <div className="flex items-center gap-2 bg-blue-950/40 px-4 py-2 rounded-xl border border-blue-900/40 shadow-inner">
               <span className="text-sm text-gray-400">Aktarım:</span>
               <span className="text-[#00E5FF] font-mono font-bold tracking-wider">{progress}%</span>
            </div>
            
            <SciFiButton variant="secondary" icon={<RefreshCcw className="w-4 h-4" />} onClick={handleReset}>
              Sıfırla
            </SciFiButton>
            
            <SciFiButton 
              variant="primary" 
              icon={<Droplet className="w-4 h-4" fill={isDraining ? "transparent" : "currentColor"} />} 
              onClick={handleDrain} 
              disabled={isDraining}
            >
               {isDraining ? "Kapasite Doluyor..." : "Sıvı Aktarımını Başlat"}
            </SciFiButton>
          </>
        }
      />

      <main className="flex-1 flex items-center justify-center relative z-20">
        <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center scale-75 md:scale-100">
            
            <svg viewBox="-400 -400 800 800" className="absolute inset-0 z-20 drop-shadow-[0_20px_50px_rgba(0,100,255,0.15)]">
                <defs>
                    {/* Estetik Sıvı Gradyanı: Üstü daha açık ve parlayan su, altı derin deniz */}
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0055AA" stopOpacity="0.85" />
                    </linearGradient>

                    <linearGradient id="waterGradDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00AACC" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#003388" stopOpacity="0.85" />
                    </linearGradient>

                    {/* Gooey Efekti: Suyun damlalarla mükemmel kavuşmasını sağlar */}
                    <filter id="gooey">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
                
                {/* 1) ARKAPLAN CAM/KUTU GÖRÜNÜMÜ */}
                <g fill="rgba(0, 229, 255, 0.02)" stroke="#222" strokeWidth="12" strokeLinejoin="round">
                    <polygon points={outlineB} />
                    <polygon points={outlineA} />
                    <polygon points={outlineC} />
                    {/* Merkezdeki üçgenin içi biraz daha koyu */}
                    <polygon points={outlineTri} fill="rgba(0, 0, 0, 0.5)" />
                </g>

                {/* 2) SIVI VE AKIŞ (Gooey Grubunun İçinde) */}
                <g filter="url(#gooey)">
                    
                    {/* İçeride Kalan Sular */}
                    {polyB && <polygon points={polyB} fill="url(#waterGrad)" />}
                    {polyA && <polygon points={polyA} fill="url(#waterGrad)" />}
                    {polyC && <polygon points={polyC} fill="url(#waterGradDark)" />}

                    {/* Dökülen Su Damlacıkları / Şelale Efekti */}
                    {isDraining && progress < 100 && DROPLETS.map(d => (
                        <motion.ellipse
                            key={d.id}
                            cx={d.x}
                            rx={d.size}
                            ry={d.size * 3} // Hız hissi vermek için dikey esnetilmiş
                            fill="#00E5FF"
                            initial={{ cy: d.startY, opacity: 0, scale: 0 }}
                            animate={{
                                cy: [d.startY, 200], // Sular 200'e (havuzun içine) iner
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1, 0.8, 0.2]
                            }}
                            transition={{
                                duration: d.duration,
                                delay: d.delay,
                                repeat: Infinity,
                                ease: "easeIn"
                            }}
                        />
                    ))}
                    
                    {/* Suyun içinden yukarı çıkan oksijen/hava baloncukları */}
                    {isDraining && BUBBLES.map(b => (
                        <motion.circle
                            key={`b-${b.id}`}
                            cx={b.x}
                            r={b.size}
                            fill="#00E5FF"
                            initial={{ cy: 300, opacity: 0, scale: 0 }}
                            animate={{ cy: 0, opacity: [0, 0.5, 0], scale: [0, 1, 0.5] }}
                            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
                        />
                    ))}
                </g>

                {/* 3) CAM PANELLERİN DIŞ ÇERÇEVE PARLAMALARI VE İNCE HATLARI (Üst Katman) */}
                <g fill="none" stroke="currentColor" className="text-[#00E5FF]" strokeWidth="3" strokeLinejoin="round" opacity="0.8">
                    <polygon points={outlineB} />
                    <polygon points={outlineA} />
                    <polygon points={outlineC} />
                    <polygon points={outlineTri} stroke="transparent" />
                </g>
                <g fill="none" stroke="white" strokeWidth="1" strokeLinejoin="round" opacity="0.2">
                    <polygon points={outlineB} />
                    <polygon points={outlineA} />
                    <polygon points={outlineC} />
                </g>

                {/* 4) MATEMATİKSEL ETİKETLER (Kalıcı ve Orantılı) */}
                {/* 
                   İkizkenar dik üçgen olduğu için alanları eşit ve tutarlıdır: 
                   a = 150*sqrt(2), a^2 = 45000 -> Etiket (50)
                   c = 300, c^2 = 90000 -> Etiket (100)
                */}
                <g className="font-sans font-bold pointer-events-none" textAnchor="middle" dominantBaseline="middle">
                    <text x="-150" y="-150" fill="white" fontSize="24" transform="rotate(-45, -150, -150)">
                        b² (50)
                    </text>
                    <text x="150" y="-150" fill="white" fontSize="24" transform="rotate(45, 150, -150)">
                        a² (50)
                    </text>
                    
                    {/* C karesindeki metne biraz sualtı havası verdik ve daha modern tuttuk */}
                    <text x="0" y="150" fill="white" fontSize="42" className="drop-shadow-lg">
                        c² (100)
                    </text>
                    
                    {progress === 100 && (
                        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <text x="0" y="200" fill="#00E5FF" fontSize="20" className="font-mono tracking-widest uppercase" style={{ filter: 'drop-shadow(0px 0px 5px rgba(0,229,255,0.5))' }}>
                                a² + b² = c²
                            </text>
                            <text x="0" y="230" fill="white" opacity="0.6" fontSize="14" className="font-mono">
                                50 + 50 = 100
                            </text>
                        </motion.g>
                    )}
                </g>

            </svg>
        </div>
      </main>
    </div>
  );
}
