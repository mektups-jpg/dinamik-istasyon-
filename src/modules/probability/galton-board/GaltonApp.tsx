import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Play, RotateCcw, Info, Trophy } from 'lucide-react';
import { useGameStore } from '../../../store/useGameStore';
import useSound from 'use-sound';
import { BlockMath, InlineMath } from 'react-katex';
import { Badge } from '../../../components/ui/badge';

// Ses dosyaları
const PLINK_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const RARE_DROP_URL = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';

export default function GaltonBoardSimulation() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [ballCount, setBallCount] = useState(0);
  const [binCounts, setBinCounts] = useState<number[]>(new Array(9).fill(0));

  // Altın Şablon: Puan ve Ses Sistemi
  const { score, addScore, soundEnabled } = useGameStore();
  const [playPlink] = useSound(PLINK_URL, { volume: 0.1, soundEnabled });
  const [playRareDrop] = useSound(RARE_DROP_URL, { volume: 0.6, soundEnabled });

  // Bin boundaries for counting
  const binWidth = 40;
  const startX = 220; // First bin center

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // 2. Setup Renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#0B0C10',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // 3. Create Static Bodies (Pegs and Bins)
    const staticBodies: Matter.Body[] = [];

    // Funnel (Huni)
    staticBodies.push(
      Matter.Bodies.rectangle(300, 50, 200, 20, { isStatic: true, angle: Math.PI / 6, render: { fillStyle: '#45A29E' } }),
      Matter.Bodies.rectangle(500, 50, 200, 20, { isStatic: true, angle: -Math.PI / 6, render: { fillStyle: '#45A29E' } })
    );

    // Pegs (Çiviler) - Normal Dağılım için üçgen dizilim
    const rows = 8;
    const spacingX = 40;
    const spacingY = 40;
    const startY = 150;

    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 1;
      const rowStartX = 400 - (pegsInRow * spacingX) / 2 + (spacingX / 2);
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = rowStartX + col * spacingX;
        const y = startY + row * spacingY;
        staticBodies.push(
          Matter.Bodies.circle(x, y, 4, { 
            isStatic: true, 
            restitution: 0.5, // Sıçrama
            friction: 0.001,
            render: { fillStyle: '#C5C6C7' } 
          })
        );
      }
    }

    // Bins (Kutular)
    const binCount = 10;
    const binHeight = 150;
    const binY = 525;
    
    for (let i = 0; i < binCount; i++) {
      const x = 200 + i * binWidth;
      staticBodies.push(
        Matter.Bodies.rectangle(x, binY, 4, binHeight, { 
          isStatic: true, 
          render: { fillStyle: '#1F2833' } 
        })
      );
    }
    
    // Zemin
    staticBodies.push(
      Matter.Bodies.rectangle(400, 600, 800, 20, { isStatic: true, render: { fillStyle: '#1F2833' } })
    );

    Matter.World.add(engine.world, staticBodies);

    // Çarpışma olayları (Ses için)
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        
        // Çiviye çarpma sesi
        if ((bodyA.label === 'Circle Body' && bodyB.isStatic) || 
            (bodyB.label === 'Circle Body' && bodyA.isStatic)) {
          // Çok fazla ses çıkmaması için rastgelelik ekleyelim
          if (Math.random() > 0.7) playPlink();
        }
      }
    });

    // 4. Run Engine and Renderer
    Matter.Render.run(render);
    
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 5. Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (render.canvas) {
        render.canvas.remove();
      }
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [playPlink]);

  // Top Düşürme Döngüsü
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && engineRef.current && ballCount < 200) {
      interval = setInterval(() => {
        // Rastgele ufak bir sapma ile topu bırak
        const xOffset = (Math.random() - 0.5) * 10;
        const ball = Matter.Bodies.circle(400 + xOffset, 20, 6, {
          restitution: 0.4,
          friction: 0.001,
          density: 0.04,
          render: { fillStyle: '#66FCF1' }
        });
        
        Matter.World.add(engineRef.current!.world, ball);
        setBallCount(prev => prev + 1);
      }, 100); // Her 100ms'de bir top
    } else if (ballCount >= 200) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, ballCount]);

  // Topların hangi kutuya düştüğünü sayma
  useEffect(() => {
    if (!engineRef.current) return;

    const checkInterval = setInterval(() => {
      const bodies = Matter.Composite.allBodies(engineRef.current!.world);
      const balls = bodies.filter(b => !b.isStatic && b.position.y > 500 && b.speed < 0.5); // Yerde duran toplar
      
      const newCounts = new Array(9).fill(0);
      let rareDropDetected = false;

      balls.forEach(ball => {
        const x = ball.position.x;
        // Hangi kutuya düştüğünü hesapla
        const binIndex = Math.floor((x - 200) / binWidth);
        if (binIndex >= 0 && binIndex < 9) {
          newCounts[binIndex]++;
          
          // Oyunlaştırma: En uç kutulara (0, 1 veya 7, 8) düşerse nadir olaydır!
          if ((binIndex === 0 || binIndex === 8) && !ball.label.includes('scored')) {
            ball.label += ' scored'; // Aynı toptan tekrar puan almamak için
            rareDropDetected = true;
            addScore(10);
          }
        }
      });

      setBinCounts(newCounts);
      if (rareDropDetected) {
        playRareDrop();
      }

    }, 500);

    return () => clearInterval(checkInterval);
  }, [addScore, playRareDrop]);

  const handleReset = () => {
    if (!engineRef.current) return;
    setIsRunning(false);
    setBallCount(0);
    setBinCounts(new Array(9).fill(0));
    
    // Sadece dinamik objeleri (topları) temizle
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const dynamicBodies = bodies.filter(b => !b.isStatic);
    Matter.World.remove(engineRef.current.world, dynamicBodies);
  };

  // En yüksek top sayısını bul (Grafik yüksekliği için)
  const maxCount = Math.max(...binCounts, 1);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0B0C10] text-white font-sans overflow-hidden">
      
      {/* SOL PANEL - SİMÜLASYON */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Oyunlaştırma Başlığı */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
          <Badge variant="outline" className="bg-[#1F2833] text-[#00E5FF] border-[#00E5FF]/30 px-4 py-1.5 text-sm">
            <Trophy className="w-4 h-4 mr-2 text-[#FFD700]" />
            {score} Puan
          </Badge>
          <div className="text-xs text-gray-400 bg-[#1F2833]/80 px-3 py-1 rounded-full">
            Nadir Uç Kutulara Düşen Top: +10 Puan
          </div>
        </div>

        {/* Matter.js Canvas Container */}
        <div ref={sceneRef} className="flex-1 w-full h-full flex items-center justify-center overflow-hidden" />
        
        {/* Canlı Histogram (Grafik) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-[2px] h-32 w-[360px] px-[20px]">
          {binCounts.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group">
              <span className="text-[10px] text-[#00E5FF] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {count}
              </span>
              <div 
                className="w-full bg-[#45A29E]/50 rounded-t-sm transition-all duration-300"
                style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ PANEL - KONTROLLER VE MATEMATİK */}
      <div className="w-full md:w-[400px] bg-[#121212] border-l border-gray-800 p-8 flex flex-col gap-6 overflow-y-auto">
        
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Galton Tahtası</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Sir Francis Galton tarafından icat edilen bu tahta, rastgele olayların nasıl öngörülebilir bir <strong>Normal Dağılım (Çan Eğrisi)</strong> oluşturduğunu gösterir.
          </p>
        </div>

        {/* Kontroller */}
        <div className="bg-[#1F2833] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-medium">Düşen Toplar</span>
            <span className="text-[#00E5FF] font-bold text-xl">{ballCount} / 200</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              disabled={ballCount >= 200}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-colors ${
                isRunning 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50' 
                  : 'bg-[#00E5FF] text-[#0B0C10] hover:bg-[#66FCF1]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Play className="w-5 h-5" />
              {isRunning ? 'Durdur' : 'Başlat'}
            </button>
            
            <button 
              onClick={handleReset}
              className="p-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
              title="Sıfırla"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matematiksel Formül (KaTeX) */}
        <div className="bg-[#1F2833] p-5 rounded-xl border border-gray-800">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Binom Dağılımı</h3>
          <p className="text-xs text-gray-400 mb-4">
            Bir topun <InlineMath math="k" />. kutuya düşme olasılığı şu formülle hesaplanır:
          </p>
          <div className="text-center text-[#00E5FF] text-lg bg-[#0B0C10] p-4 rounded-lg overflow-x-auto">
            <BlockMath math="P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}" />
          </div>
          <ul className="text-xs text-gray-500 mt-4 space-y-2">
            <li><InlineMath math="n" /> = Çivi satırı sayısı</li>
            <li><InlineMath math="k" /> = Kutu numarası</li>
            <li><InlineMath math="p" /> = Sağa düşme olasılığı (0.5)</li>
          </ul>
        </div>

        {/* Bilgi Kutusu */}
        <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 p-5 rounded-xl mt-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00E5FF] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#00E5FF] font-bold text-sm mb-1">Neden Çan Eğrisi?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Her çivide topun sağa veya sola düşme ihtimali %50'dir. Ortadaki kutulara ulaşmak için birçok farklı yol varken, en uçtaki kutulara ulaşmak için topun <strong>sürekli aynı yöne</strong> düşmesi gerekir. Bu yüzden orta kutular her zaman daha fazla top alır.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
