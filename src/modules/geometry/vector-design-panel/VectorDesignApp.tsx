import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Spline, Navigation, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { Protractor } from '../../../components/ui/Protractor';
import { MeasurementPanel } from '../../../components/ui/MeasurementPanel';

// -------------------------------------------------------------
// VIBE: Siyah Zeminli Vektör (CAD) Arayüzü, Işın & Açı Fiziği
// Matematiksel Kesinlik: Merkez(400,300), L1(Cyan), L2(Mor) - Tam 45°
// -------------------------------------------------------------

export default function VectorDesignApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const { showMessage } = useAstroBotStore();

  type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  const [phase, setPhase] = useState<Phase>(0);
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  const [activeTool, setActiveTool] = useState<'LINE' | 'RAY' | 'SEGMENT'>('RAY');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [line1Drawn, setLine1Drawn] = useState(false);
  const [line2Drawn, setLine2Drawn] = useState(false);
  const [rayDrawn, setRayDrawn] = useState(false);
  const [segmentDrawn, setSegmentDrawn] = useState(false);

  const [selectedAngles, setSelectedAngles] = useState<number[]>([]);
  const [protractorPlaced, setProtractorPlaced] = useState(false);
  const [angleInputValue, setAngleInputValue] = useState('');
  const [showVictory, setShowVictory] = useState(false);

  const setBotMsg = (msg: { id: number, text: string, type: 'info' | 'success' | 'error' | 'warning' }) => {
    showMessage(msg.text, msg.type as any);
  };

  useEffect(() => {
    setBotMsg({
      id: Date.now(),
      text: "Komutanım, CAD paneline hoş geldin. Önce panelden 'DOĞRU' (İki ucu sonsuz) aracını seçerek işe başlayalım.",
      type: 'info'
    });
  }, []);

  const [nodes, setNodes] = useState<{ id: string, x: number, y: number, target: number, level: number, type: string }[]>([]);
  const [angleRegions, setAngleRegions] = useState<{ id: number, points: string, type: "ACUTE" | "OBTUSE", color: string }[]>([]);
  const [dynamicShapes, setDynamicShapes] = useState<{
    l1: {x1:number, y1:number, x2:number, y2:number},
    l2: {x1:number, y1:number, x2:number, y2:number},
    ray: {sx:number, sy:number, dx:number, dy:number},
    segment: {x1:number, y1:number, x2:number, y2:number},
    targetAngle: number,
    rayAngleText: number,
    segmentAngleText: number,
    cx: number,
    cy: number,
    p4Rot: number,
    p6Rot: number,
    p9Rot: number,
    p9x: number,
    p9y: number
  } | null>(null);

  useEffect(() => {
    // Rastgele nokta ve açı üretimi (Faz 1)
    const cx = 350 + Math.random() * 100;
    const cy = 250 + Math.random() * 100;

    // L1 açısı (10 ile 70 derece arası)
    const a1Deg = 10 + Math.random() * 60;
    const a1 = a1Deg * Math.PI / 180;
    
    // L2 açısı (L1'den genelde 30 ile 80 derece daha büyük bir açı olsun dar açı için)
    const a2Deg = a1Deg + 30 + Math.random() * 50;
    const a2 = a2Deg * Math.PI / 180;

    const acuteAng = Math.round(a2Deg - a1Deg);

    const d1 = 150 + Math.random() * 50;
    const n1x = cx + Math.cos(a1) * d1;
    const n1y = cy + Math.sin(a1) * d1; 
    const n2x = cx - Math.cos(a1) * d1;
    const n2y = cy - Math.sin(a1) * d1;

    const d2 = 150 + Math.random() * 50;
    const n3x = cx + Math.cos(a2) * d2;
    const n3y = cy + Math.sin(a2) * d2;
    const n4x = cx - Math.cos(a2) * d2;
    const n4y = cy - Math.sin(a2) * d2;

    const getBounds = (ang: number) => ({
      x1: cx - Math.cos(ang) * 1500,
      y1: cy - Math.sin(ang) * 1500,
      x2: cx + Math.cos(ang) * 1500,
      y2: cy + Math.sin(ang) * 1500
    });

    // Ray
    // Ray starts from intersection cx, cy so we can measure angle relative to L1
    // We want the ray to be outside the acute angle region entirely. The acute region is from a1Deg to a2Deg.
    // So we pick an angle between a2Deg + 40 and a1Deg + 140
    const rx1 = cx;
    const ry1 = cy;
    
    const rayAngleDegRel = 100 + Math.random() * 40; // 100-140 deg from L1, perfectly safe
    const rAngle = a1Deg + rayAngleDegRel;
    const rAngleRad = rAngle * Math.PI / 180;
    
    const rx2 = rx1 + Math.cos(rAngleRad) * 200;
    const ry2 = ry1 + Math.sin(rAngleRad) * 200;
    
    const rRayDx = rx1 + (Math.cos(rAngleRad)) * 1500;
    const rRayDy = ry1 + (Math.sin(rAngleRad)) * 1500;
    const rayAngleText = Math.round(rayAngleDegRel);

    // Segment
    // Let Segment connect a point on Ray to a point on L2 to form a triangle
    // point on ray:
    const segDistRay = 200 + Math.random() * 50;
    const sx1 = cx + Math.cos(rAngleRad) * segDistRay;
    const sy1 = cy + Math.sin(rAngleRad) * segDistRay;
    
    // point on L2:
    const segDistL2 = 200 + Math.random() * 50;
    const sx2 = cx + Math.cos(a2) * segDistL2;
    const sy2 = cy + Math.sin(a2) * segDistL2;

    // Law of cosines to find angle in the triangle if we want... or just let them compute an arbitrary angle.
    // Actually just have them measure any acute angle. Let's ask for the angle of Segment relative to the horizontal or something.
    // "bunda da interaktif bişey yok iletkiyi kullanalım"
    // Just a placeholder angle measured between segment and L2.
    // V1 = (cx - sx2, cy - sy2), V2 = (sx1 - sx2, sy1 - sy2)
    const v1 = {x: cx - sx2, y: cy - sy2};
    const v2 = {x: sx1 - sx2, y: sy1 - sy2};
    const dp = v1.x*v2.x + v1.y*v2.y;
    const mag1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y);
    const mag2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y);
    const segmentAngleText = Math.round(Math.acos(dp / (mag1 * mag2)) * 180 / Math.PI);

    const p4Rot = a1Deg;
    const p6Rot = a1Deg - 180;
    
    let v1Ang = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
    let v2Ang = Math.atan2(v2.y, v2.x) * 180 / Math.PI;
    v1Ang = (v1Ang + 360) % 360;
    v2Ang = (v2Ang + 360) % 360;
    
    let diff = v2Ang - v1Ang;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    
    let p9Rot = 0;
    if (diff > 0) {
        p9Rot = v1Ang - 180;
    } else {
        p9Rot = v2Ang - 180;
    }
    const p9x = sx2;
    const p9y = sy2;

    setNodes([
        { id: 'N1', x: n1x, y: n1y, target: 1, level: 1, type: 'LINE' },
        { id: 'N2', x: n2x, y: n2y, target: 1, level: 1, type: 'LINE' },
        { id: 'N3', x: n3x, y: n3y, target: 2, level: 1, type: 'LINE' },
        { id: 'N4', x: n4x, y: n4y, target: 2, level: 1, type: 'LINE' },
        
        { id: 'N5', x: rx1, y: ry1, target: 3, level: 2, type: 'RAY_START' },
        { id: 'N6', x: rx2, y: ry2, target: 3, level: 2, type: 'RAY_DIR' },
        
        { id: 'N7', x: sx1, y: sy1, target: 4, level: 3, type: 'SEGMENT' },
        { id: 'N8', x: sx2, y: sy2, target: 4, level: 3, type: 'SEGMENT' },
    ]);

    setDynamicShapes({
       l1: getBounds(a1),
       l2: getBounds(a2),
       ray: { sx: rx1, sy: ry1, dx: rRayDx, dy: rRayDy },
       segment: { x1: sx1, y1: sy1, x2: sx2, y2: sy2 },
       targetAngle: acuteAng,
       rayAngleText,
       segmentAngleText,
       cx, cy,
       p4Rot, p6Rot, p9Rot, p9x, p9y
    });

    const d = 1000;
    const a3 = a1 + Math.PI;
    const a4 = a2 + Math.PI;

    const makePol = (angA: number, angB: number) => {
        let mid = (angA + angB) / 2;
        if (Math.abs(angA - angB) > Math.PI) {
           mid += Math.PI;
        }
        return `${cx},${cy} ${cx + Math.cos(angA)*d},${cy + Math.sin(angA)*d} ${cx + Math.cos(mid)*d*1.5},${cy + Math.sin(mid)*d*1.5} ${cx + Math.cos(angB)*d},${cy + Math.sin(angB)*d}`;
    };

    setAngleRegions([
        { id: 1, points: makePol(a1, a2), type: "ACUTE", color: "#00E5FF" }, 
        { id: 2, points: makePol(a3, a4), type: "ACUTE", color: "#00E5FF" }, 
        { id: 3, points: makePol(a2, a3), type: "OBTUSE", color: "#B388FF" }, 
        { id: 4, points: makePol(a4, a1 + 2*Math.PI), type: "OBTUSE", color: "#B388FF" },
    ]);
  }, []);

  useEffect(() => {
    if (level === 1 && activeTool === 'LINE' && phase === 0) {
       setPhase(1);
       setBotMsg({ id: Date.now(), text: "Harika! Şimdi mavi (Cyan) renkteki uzay noktalarına tıklayarak ilk DOĞRU'yu inşa et.", type: 'success' });
    }
    if (level === 2 && activeTool === 'RAY' && phase === 5) {
       setPhase(6);
       setBotMsg({ id: Date.now(), text: "Işın devrede. Önce BAŞLANGIÇ noktasına (turuncu), sonra yön hedefine tıkla ki ışın uzaya uzansın.", type: 'info' });
       setSelectedNodes([]);
    }
    if (level === 3 && activeTool === 'SEGMENT' && phase === 8) {
       setPhase(9);
       setBotMsg({ id: Date.now(), text: "Parça devrede. İki istasyon arasını ölçülebilir kapalı bir boru hattıyla (yeşil) birleştir.", type: 'info' });
       setSelectedNodes([]);
    }
  }, [level, activeTool, phase]);

  const handleNodeClick = (id: string, target: number, nLevel: number, nType: string) => {
    if (nLevel !== level) return;
    
    if (level === 1) {
        if (phase !== 1 && phase !== 2) return;
        if (phase === 1 && target !== 1) return;
        if (phase === 2 && target !== 2) return;
        
        if (activeTool !== 'LINE') {
          setBotMsg({ id: Date.now(), text: "Mühendisim! Bu aşamada noktaları birleştirmek için 'DOĞRU' aracını seçmelisin.", type: 'error' });
          return;
        }

        if (selectedNodes.includes(id)) {
          setSelectedNodes(selectedNodes.filter(n => n !== id));
          return;
        }

        const newNodes = [...selectedNodes, id];
        setSelectedNodes(newNodes);

        if (newNodes.length === 2) {
          if (phase === 1) {
            setLine1Drawn(true);
            setSelectedNodes([]);
            setPhase(2);
            setBotMsg({ id: Date.now(), text: "Doğru çizimi tamamlandı! (MAT.5.3.1.1). Şimdi mor lazer için diğer iki düğümü bağla.", type: 'success' });
          } else if (phase === 2) {
            setLine2Drawn(true);
            setSelectedNodes([]);
            setPhase(3);
            setBotMsg({ id: Date.now(), text: "DİKKAT KESİŞİM! 4 farklı açı alanı yarattık. Birbirine bakmayan 'TERS AÇI' çiftini (sivri olan o dar iki bölgeyi) bul ve tıkla.", type: 'info' });
          }
        }
    } else if (level === 2) {
        if (phase !== 6) return;
        if (activeTool !== 'RAY') {
            setBotMsg({ id: Date.now(), text: "Şimdi 'IŞIN' aracını kullanmalısın.", type: 'error' });
            return;
        }
        
        if (selectedNodes.length === 0 && nType !== 'RAY_START') {
            setBotMsg({ id: Date.now(), text: "Işının sabit bir başlangıç noktası vardır. Önce turuncu olan ana merkeze tıkla.", type: 'info' });
            return;
        }

        if (selectedNodes.includes(id)) return;
        
        const newNodes = [...selectedNodes, id];
        setSelectedNodes(newNodes);

        if (newNodes.length === 2) {
            setRayDrawn(true);
            setSelectedNodes([]);
            setPhase(7); // Changed to 7 so it stays at level 2 waiting for measurement
            setBotMsg({ id: Date.now(), text: "Işın devrede! Lütfen İletkiyi kullanarak bu ışının ilk doğruyla (mavi) yaptığı iç açıyı ölç.", type: 'success' });
        }
    } else if (level === 3) {
        if (phase !== 9) return; // changed phase check
        if (activeTool !== 'SEGMENT') {
            setBotMsg({ id: Date.now(), text: "Son adım! 'PARÇA' aracını seçmelisin.", type: 'error' });
            return;
        }

        if (selectedNodes.includes(id)) return;
        
        const newNodes = [...selectedNodes, id];
        setSelectedNodes(newNodes);

        if (newNodes.length === 2) {
            setSegmentDrawn(true);
            setSelectedNodes([]);
            setPhase(10); // changed from phase 9 directly triggering victory, now it triggers protractor
            setBotMsg({ id: Date.now(), text: "Doğru parçası başarıyla bağlandı! Artık bir üçgenimiz var. İletki ile bu doğru parçasının mor doğruyla yaptığı iç açıyı ölç.", type: 'success' });
        }
    }
  };

  const handleAngleClick = (regionId: number, regionType: string) => {
    if (phase !== 3) return;
    
    let newAngles = [...selectedAngles];
    if (newAngles.includes(regionId)) {
        newAngles = newAngles.filter(id => id !== regionId);
    } else {
        newAngles.push(regionId);
        if (newAngles.length > 2) newAngles.shift(); // Sadece son 2 id kalsın
    }
    
    setSelectedAngles(newAngles);

    if (newAngles.length === 2) {
        const has1And2 = newAngles.includes(1) && newAngles.includes(2);
        const has3And4 = newAngles.includes(3) && newAngles.includes(4);

        if (has1And2 || has3And4) {
            setBotMsg({ id: Date.now(), text: "Ters Açılar Tespit Edildi! Birbirine zıt bakan TERS AÇILAR her zaman eşittir (MAT.5.3.4.1).", type: 'success' });
            setTimeout(() => setPhase(4), 4500); // Protractor ekranına geç
        } else {
            setBotMsg({ id: Date.now(), text: "Sistem Alarmı! Bu açılar yan yana (KOMŞU). Sen zıt yönlü olan TERS açıları bulmalısın! Seçimi sıfırlıyorum.", type: 'error' });
            setTimeout(() => setSelectedAngles([]), 2000);
        }
    }
  };

  const [activeDrag, setActiveDrag] = useState<'NONE' | 'MOVE' | 'ROTATE'>('NONE');
  const [pPos, setPPos] = useState({ x: 400, y: 300 });
  const [pRot, setPRot] = useState(0);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      if (activeDrag === 'NONE' || !svgRef.current) return;
      const CTM = svgRef.current.getScreenCTM();
      if (!CTM) return;
      const x = (e.clientX - CTM.e) / CTM.a;
      const y = (e.clientY - CTM.f) / CTM.d;

      if (activeDrag === 'MOVE') {
          setPPos({ x, y });
      } else if (activeDrag === 'ROTATE') {
          let angle = Math.atan2(y - pPos.y, x - pPos.x) * 180 / Math.PI;
          setPRot(angle);
      }
  };

  const handleSvgPointerUp = () => {
      setActiveDrag('NONE');
  };

  const handlePlaceProtractor = () => {
      setPPos({ x: 400, y: 300 });
      setPRot(0);
      setProtractorPlaced(true);
      setBotMsg({ id: Date.now(), text: "Sanal İletki kilitlendi! Merkezinden tutarak taşıyabilir, 0° çizgisinden tutarak döndürebilirsin.", type: 'info' });
  };

  const handleAngleError = (targetStr: string, inputStr: string, baseMsg: string) => {
    const t = parseInt(targetStr);
    const i = parseInt(inputStr);
    if (isNaN(t) || isNaN(i)) {
      setBotMsg({ id: Date.now(), text: baseMsg + " Lütfen sadece sayı gir.", type: 'error' });
      return;
    }
    const diff = i - t;
    if (diff > 0) {
      setBotMsg({ id: Date.now(), text: `${baseMsg} Girdiğin değer asıl açıdan ${diff}° daha BÜYÜK. Biraz daha küçük bir açı dene.`, type: 'error' });
    } else if (diff < 0) {
      setBotMsg({ id: Date.now(), text: `${baseMsg} Girdiğin değer asıl açıdan ${Math.abs(diff)}° daha KÜÇÜK. Biraz daha büyük bir sayı denemelisin.`, type: 'error' });
    }
  };

  const handleVerifyAngle = () => {
    if (!dynamicShapes) return;

    if (phase === 4) {
      const target = dynamicShapes.targetAngle.toString();
      if (angleInputValue.trim() === target) {
        setBotMsg({ id: Date.now(), text: `Tam İsabet! Açı ${target}°. Bu da demek ki Ters açısı da ${target}°. Şimdi 'IŞIN' (Ray) aracını seçerek enerji merkezinden uzaya yönelecek bir enerji gönderelim.`, type: 'success' });
        setTimeout(() => {
          setProtractorPlaced(false);
          setAngleInputValue('');
          setLevel(2);
          setPhase(5);
          setSelectedNodes([]);
          setActiveTool('RAY');
        }, 3500);
      } else {
        handleAngleError(target, angleInputValue.trim(), `Hatalı Okuma!`);
      }
    } else if (phase === 7) {
      const target = dynamicShapes.rayAngleText.toString();
      if (angleInputValue.trim() === target) {
        setBotMsg({ id: Date.now(), text: `Harika! ${target}° doğru. Işının oluşturduğu açıyı yakaladık! Şimdi 'PARÇA' aracını seçip segment çizeceğiz.`, type: 'success' });
        setTimeout(() => {
          setProtractorPlaced(false);
          setAngleInputValue('');
          setLevel(3);
          setPhase(8);
          setSelectedNodes([]);
          setActiveTool('SEGMENT');
        }, 3500);
      } else {
        handleAngleError(target, angleInputValue.trim(), `Hatalı Okuma!`);
      }
    } else if (phase === 10) {
      const target = dynamicShapes.segmentAngleText.toString();
      if (angleInputValue.trim() === target) {
        setBotMsg({ id: Date.now(), text: `Doğru parçası başarıyla ölçüldü! Açı ${target}°. Her iki ucu da sınırlı ve ölçülebilir. Görev tamam!`, type: 'success' });
        setTimeout(() => {
            setProtractorPlaced(false);
            setAngleInputValue('');
            unlockAtom('MAT.5.3.1.1');
            unlockAtom('MAT.5.3.1.b');
            unlockAtom('MAT.5.3.1.c');
            unlockAtom('MAT.5.3.4.1');
            unlockAtom('MAT.5.3.4.2'); 
            unlockModule('vector-design-panel');
            addScore(1500);
            setShowVictory(true);
        }, 3500);
      } else {
        handleAngleError(target, angleInputValue.trim(), `Hatalı Okuma!`);
      }
    }
  };

  return (
    <div className="h-full w-full bg-[#05050A] text-white flex flex-col font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden overflow-y-auto">
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between p-6 relative z-20 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-12 h-12 bg-[#12121A] rounded-xl flex items-center justify-center border border-gray-800 hover:border-[#00E5FF] transition-colors group z-50">
            <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Spline className="w-6 h-6 text-[#00E5FF]" /> VEKTÖREL <span className="text-[#00E5FF]">CAD PANELİ</span>
            </h1>
            <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Işın, Doğru, Açı Fiziği</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6 relative z-20 pb-40">
        
        {/* Sol Menü: Araçlar & Terminal */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-[#12121A]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Çizim Araçları</h3>
             
             <button onClick={() => setActiveTool('LINE')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'LINE' ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-full h-0.5 bg-current relative">
                      <div className="absolute -left-1 -top-1 border-t border-r border-current w-2 h-2 -rotate-45"></div>
                      <div className="absolute -right-1 -top-1 border-t border-r border-current w-2 h-2 rotate-45"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Doğru</span><span className="block text-[10px] opacity-70">İki Ucu Sonsuz</span></div>
             </button>

             <button onClick={() => setActiveTool('RAY')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'RAY' ? 'bg-[#B388FF]/10 border-[#B388FF] text-[#B388FF]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-6 h-0.5 bg-current relative ml-2">
                       <div className="absolute -left-2 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                       <div className="absolute -right-1 -top-1 border-t border-r border-current w-2 h-2 rotate-45"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Işın</span><span className="block text-[10px] opacity-70">Tek Ucu Sonsuz</span></div>
             </button>

             <button onClick={() => setActiveTool('SEGMENT')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'SEGMENT' ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-6 h-0.5 bg-current relative">
                       <div className="absolute -left-1 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                       <div className="absolute -right-1 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Parça</span><span className="block text-[10px] opacity-70">İki Ucu Kapalı</span></div>
             </button>
          </div>

          <MeasurementPanel
            visible={phase === 4 || phase === 7 || phase === 10}
            protractorPlaced={protractorPlaced}
            phase={phase}
            angleInputValue={angleInputValue}
            setAngleInputValue={setAngleInputValue}
            handlePlaceProtractor={handlePlaceProtractor}
            handleVerifyAngle={handleVerifyAngle}
          />
        </div>

        {/* Sağ Panel: Vektörel CAD Ekranı */}
        <div className="flex-1 w-full h-[500px] lg:h-auto bg-[#080B12] rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(0,229,255,0.05)] relative overflow-hidden flex items-center justify-center min-h-[500px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] to-transparent pointer-events-none"/>

            <div className="relative w-full h-full max-w-[800px] max-h-[600px] flex items-center justify-center">
                <svg ref={svgRef} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible"
                     onPointerMove={handleSvgPointerMove} onPointerUp={handleSvgPointerUp} onPointerLeave={handleSvgPointerUp}>

                    <AnimatePresence>
                       {(phase >= 3 && level === 1) && angleRegions.map((region) => {
                          const isSelected = selectedAngles.includes(region.id);
                          return (
                              <motion.polygon 
                                 key={region.id}
                                 points={region.points}
                                 initial={{ opacity: 0, fill: region.color }} 
                                 animate={{ 
                                     opacity: isSelected ? 0.4 : 0.05,
                                     strokeOpacity: isSelected ? 1 : 0
                                 }}
                                 stroke={region.color}
                                 strokeWidth="2"
                                 whileHover={{ opacity: 0.15 }}
                                 className={`cursor-pointer transition-colors ${phase !== 3 ? 'pointer-events-none' : 'pointer-events-auto'}`}
                                 onClick={() => handleAngleClick(region.id, region.type)}
                              />
                          );
                       })}
                    </AnimatePresence>

                    <AnimatePresence>
                       {protractorPlaced && dynamicShapes && (
                         <motion.g
                             initial={{ opacity: 0, scale: 0.8 }} 
                             animate={{ opacity: 1, scale: 1 }} 
                             transition={{ duration: 1 }}
                             className="filter drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                         >
                            <circle cx={phase === 10 ? dynamicShapes.segment.x2 : dynamicShapes.cx} cy={phase === 10 ? dynamicShapes.segment.y2 : dynamicShapes.cy} r="60" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                            <circle cx={phase === 10 ? dynamicShapes.segment.x2 : dynamicShapes.cx} cy={phase === 10 ? dynamicShapes.segment.y2 : dynamicShapes.cy} r="5" fill="#FFD700" />
                            {/* Semi-circle text hints */}
                            <text x={(phase === 10 ? dynamicShapes.segment.x2 : dynamicShapes.cx) + 65} y={(phase === 10 ? dynamicShapes.segment.y2 : dynamicShapes.cy) + 5} fill="#FFD700" fontSize="10" fontWeight="bold">0°</text>
                            <text x={(phase === 10 ? dynamicShapes.segment.x2 : dynamicShapes.cx) - 5} y={(phase === 10 ? dynamicShapes.segment.y2 : dynamicShapes.cy) - 65} fill="#FFD700" fontSize="10" fontWeight="bold">90°</text>
                            <text x={(phase === 10 ? dynamicShapes.segment.x2 : dynamicShapes.cx) - 80} y={(phase === 10 ? dynamicShapes.segment.y2 : dynamicShapes.cy) + 5} fill="#FFD700" fontSize="10" fontWeight="bold">180°</text>
                         </motion.g>
                       )}
                    </AnimatePresence>

                    {line1Drawn && dynamicShapes && (
                        <motion.line 
                            x1={dynamicShapes.l1.x1} y1={dynamicShapes.l1.y1} x2={dynamicShapes.l1.x2} y2={dynamicShapes.l1.y2}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
                            stroke="#00E5FF" strokeWidth="4" strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.9))' }}
                        />
                    )}

                    {line2Drawn && dynamicShapes && (
                        <motion.line 
                            x1={dynamicShapes.l2.x1} y1={dynamicShapes.l2.y1} x2={dynamicShapes.l2.x2} y2={dynamicShapes.l2.y2}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
                            stroke="#B388FF" strokeWidth="4" strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 12px rgba(179,136,255,0.9))' }}
                        />
                    )}

                    {rayDrawn && dynamicShapes && (
                        <motion.line 
                            x1={dynamicShapes.ray.sx} y1={dynamicShapes.ray.sy} x2={dynamicShapes.ray.dx} y2={dynamicShapes.ray.dy}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
                            stroke="#FFB74D" strokeWidth="4" strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 12px rgba(255,183,77,0.9))' }}
                        />
                    )}

                    {segmentDrawn && dynamicShapes && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            <motion.line 
                                x1={dynamicShapes.segment.x1} y1={dynamicShapes.segment.y1} x2={dynamicShapes.segment.x2} y2={dynamicShapes.segment.y2}
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
                                stroke="#00FF88" strokeWidth="6" strokeLinecap="round"
                                style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,136,0.9))' }}
                            />
                            {/* İki Uç Nokta */}
                            <circle cx={dynamicShapes.segment.x1} cy={dynamicShapes.segment.y1} r="10" fill="#00FF88" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,136,1))' }} />
                            <circle cx={dynamicShapes.segment.x2} cy={dynamicShapes.segment.y2} r="10" fill="#00FF88" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,136,1))' }} />
                        </motion.g>
                    )}

                    {nodes.map(node => {
                        if (node.level !== level) return null;

                        const isSelected = selectedNodes.includes(node.id);
                        
                        let isDrawn = false;
                        if (level === 1) isDrawn = (node.target === 1 ? line1Drawn : line2Drawn);
                        if (level === 2) isDrawn = rayDrawn;
                        if (level === 3) isDrawn = segmentDrawn;

                        if (isDrawn) return null; 
                        if (level === 1 && phase > 2) return null; 

                        let color = "#00E5FF";
                        if (level === 1 && node.target === 2) color = "#B388FF";
                        if (level === 2) color = node.type === 'RAY_START' ? "#FFB74D" : "#FFF";
                        if (level === 3) color = "#00FF88";

                        let isTarget = false;
                        if (level === 1) isTarget = (node.target === 1 ? phase === 1 : phase === 2);
                        if (level === 2) isTarget = phase === 6;
                        if (level === 3) isTarget = phase === 9;

                        return (
                            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onClick={() => handleNodeClick(node.id, node.target, node.level, node.type)}>
                                <circle r="24" fill="transparent" className={`cursor-pointer ${isTarget ? 'pointer-events-auto' : 'pointer-events-none'}`} />
                                <motion.circle 
                                    r={6} 
                                    fill={color}
                                    animate={{ 
                                        scale: isSelected ? 1.5 : (isTarget ? [1, 1.4, 1] : 0.6),
                                        opacity: isTarget ? 1 : 0.3
                                    }}
                                    transition={{ repeat: isTarget && !isSelected ? Infinity : 0, duration: 1.5 }}
                                    style={{ filter: `drop-shadow(0 0 10px ${color})` }}
                                />
                                {isSelected && (
                                    <motion.circle r="14" fill="none" stroke="#FFFFFF" strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
                                )}
                            </g>
                        )
                    })}

                    <Protractor placed={protractorPlaced} pPos={pPos} pRot={pRot} setActiveDrag={setActiveDrag} />
                </svg>

            </div>
        </div>
      </main>
      
      {/* Zafer (Kazanım) Ekranı */}
      <AnimatePresence>
        {showVictory && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="bg-[#12121A] border border-[#00FF88]/40 p-10 rounded-[2.5rem] max-w-2xl w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,255,136,0.15)]">
               <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00FF88]/20 blur-[120px] rounded-full pointer-events-none"></div>
               
               <div className="w-24 h-24 bg-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00FF88]/30">
                 <CheckCircle2 className="w-12 h-12 text-[#00FF88] drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]" />
               </div>
               
               <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                 FİZİK <span className="text-[#00FF88]">ÇÖZÜLDÜ!</span>
               </h2>
               <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                  Ters ve Komşu açılara ait derin kuralları uygulamalı ispat ettin! İki lazer kesiştiğinde oluşan karşılıklı açıların mükemmel simetrisi seninle.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-black/50 border border-gray-800 p-5 rounded-2xl">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
                        <span className="font-mono text-[#00E5FF] font-bold text-xs uppercase tracking-wider">MAT.5.3.1.1</span>
                     </div>
                     <p className="text-white text-sm">Uzayda Doğru çizimleri ve kesişimleri anlaşıldı.</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-black/50 border border-gray-800 p-5 rounded-2xl">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#B388FF] animate-pulse"></div>
                        <span className="font-mono text-[#B388FF] font-bold text-xs uppercase tracking-wider">MAT.5.3.4.1</span>
                     </div>
                     <p className="text-white text-sm">Kesici iki doğrunun oluşturduğu ters (eşit) açılar keşfedildi.</p>
                  </motion.div>
               </div>

               <div className="flex justify-center">
                 <Link to="/" className="px-10 py-5 bg-[#00FF88] hover:bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                   ANA TELSİZE DÖN <Navigation className="w-5 h-5 rotate-90" />
                 </Link>
               </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
