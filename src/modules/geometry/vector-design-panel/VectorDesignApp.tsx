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
  type Tool = 'NONE' | 'LINE' | 'RAY' | 'SEGMENT';
  const [phase, setPhase] = useState<Phase>(0);
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  const [activeTool, setActiveTool] = useState<Tool>('NONE');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [line1Drawn, setLine1Drawn] = useState(false);
  const [line2Drawn, setLine2Drawn] = useState(false);
  const [rayDrawn, setRayDrawn] = useState(false);
  const [segmentDrawn, setSegmentDrawn] = useState(false);

  const [selectedAngles, setSelectedAngles] = useState<number[]>([]);
  const [angleMeasureKind, setAngleMeasureKind] = useState<'ACUTE' | 'OBTUSE'>('ACUTE');
  const [protractorPlaced, setProtractorPlaced] = useState(false);
  const [angleInputValue, setAngleInputValue] = useState('');
  const [showVictory, setShowVictory] = useState(false);

  const setBotMsg = (msg: { id: number, text: string, type: 'info' | 'success' | 'error' }) => {
    showMessage(msg.text, msg.type);
  };

  useEffect(() => {
    setBotMsg({
      id: Date.now(),
      text: "Önce 'Doğru' aracına bas. Sonra ekrandaki iki mavi noktaya sırayla dokunacağız.",
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
    // Let them measure a focused acute angle with the protractor.
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
       setBotMsg({ id: Date.now(), text: "Harika. Şimdi iki mavi noktaya sırayla dokun; çizgi iki yöne doğru uzayacak.", type: 'success' });
    }
    if (level === 2 && activeTool === 'RAY' && phase === 5) {
       setPhase(6);
       setBotMsg({ id: Date.now(), text: "Işın hazır. Önce turuncu başlangıç noktasına, sonra beyaz yön noktasına dokun.", type: 'info' });
       setSelectedNodes([]);
    }
    if (level === 3 && activeTool === 'SEGMENT' && phase === 8) {
       setPhase(9);
       setBotMsg({ id: Date.now(), text: "Doğru parçası hazır. İki yeşil uç noktayı birleştir; parça sadece iki uç arasında kalır.", type: 'info' });
       setSelectedNodes([]);
    }
  }, [level, activeTool, phase]);

  const getExpectedTool = (): Exclude<Tool, 'NONE'> | null => {
    if (level === 1 && (phase === 0 || phase === 1 || phase === 2)) return 'LINE';
    if (level === 2 && (phase === 5 || phase === 6)) return 'RAY';
    if (level === 3 && (phase === 8 || phase === 9)) return 'SEGMENT';
    return null;
  };

  const toolDisplayNames: Record<Exclude<Tool, 'NONE'>, string> = {
    LINE: 'Doğru',
    RAY: 'Işın',
    SEGMENT: 'Doğru parçası'
  };

  const getAngleKind = (angle: number) => {
    if (angle === 90) return 'dik';
    return angle < 90 ? 'dar' : 'geniş';
  };

  const rayAngleKind = dynamicShapes ? getAngleKind(dynamicShapes.rayAngleText) : 'geniş';
  const rayAngleTitle = rayAngleKind === 'geniş' ? 'Geniş açıyı ölç' : rayAngleKind === 'dar' ? 'Dar açıyı ölç' : 'Dik açıyı ölç';
  const segmentAngleKind = dynamicShapes ? getAngleKind(dynamicShapes.segmentAngleText) : 'dar';
  const segmentAngleTitle = segmentAngleKind === 'geniş' ? 'Son geniş açıyı ölç' : segmentAngleKind === 'dar' ? 'Son dar açıyı ölç' : 'Son dik açıyı ölç';
  const rayProtractorGuide = dynamicShapes ? (() => {
    const dx = dynamicShapes.ray.dx - dynamicShapes.ray.sx;
    const dy = dynamicShapes.ray.dy - dynamicShapes.ray.sy;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;

    return {
      x1: dynamicShapes.cx,
      y1: dynamicShapes.cy,
      x2: dynamicShapes.cx + ux * 255,
      y2: dynamicShapes.cy + uy * 255,
      dotX: dynamicShapes.cx + ux * 238,
      dotY: dynamicShapes.cy + uy * 238,
      labelX: Math.min(700, Math.max(100, dynamicShapes.cx + ux * 290)),
      labelY: Math.min(545, Math.max(150, dynamicShapes.cy + uy * 290)),
      zoomAngle: dynamicShapes.rayAngleText,
      zoomX: Math.min(560, Math.max(170, dynamicShapes.cx + 120)),
      zoomY: Math.min(525, Math.max(140, dynamicShapes.cy + 190))
    };
  })() : null;

  const handleToolSelect = (tool: Exclude<Tool, 'NONE'>) => {
    const expectedTool = getExpectedTool();

    if (!expectedTool) {
      setBotMsg({ id: Date.now(), text: "Şimdi çizim aracı değil, ekrandaki açı/ölçüm görevini tamamlıyoruz.", type: 'info' });
      return;
    }

    if (tool !== expectedTool) {
      setBotMsg({
        id: Date.now(),
        text: `Bu araç biraz sonra gelecek. Şimdi ${toolDisplayNames[expectedTool]} aracını seçmelisin.`,
        type: 'error'
      });
      return;
    }

    setActiveTool(tool);
  };

  const currentGuide = (() => {
    switch (phase) {
      case 0:
        return { step: '1 / 10', title: 'Doğru aracını seç', detail: 'Soldaki mavi Doğru kartına bas. Doğru iki yöne uzar.' };
      case 1:
        return { step: '2 / 10', title: 'İki mavi noktaya dokun', detail: 'Birinci ve ikinci mavi noktayı seçince ilk doğru çizilecek.' };
      case 2:
        return { step: '3 / 10', title: 'İki mor noktaya dokun', detail: 'İkinci doğruyu çiz; iki doğru kesişince açı alanları açılacak.' };
      case 3:
        return { step: '4 / 10', title: 'Ters açı çiftini seç', detail: 'Yan yana değil, karşı karşıya duran iki açı alanına dokun.' };
      case 4:
        return { step: '5 / 10', title: 'Seçtiğin açıyı ölç', detail: 'İletkiyi aç, seçtiğin ters açıyı derece olarak oku ve kutuya yaz.' };
      case 5:
        return { step: '6 / 10', title: 'Işın aracını seç', detail: 'Işın bir noktadan başlar ve tek yöne uzar.' };
      case 6:
        return { step: '7 / 10', title: 'Başlangıç ve yönü seç', detail: 'Önce turuncu başlangıç noktasına, sonra beyaz yön noktasına dokun.' };
      case 7:
        return { step: '8 / 10', title: rayAngleTitle, detail: `İletkiyle ışının mavi doğruyla yaptığı ${rayAngleKind} açıyı bul.` };
      case 8:
        return { step: '9 / 10', title: 'Doğru parçası aracını seç', detail: 'Doğru parçası iki uç nokta arasında kalır.' };
      case 9:
        return { step: '10 / 10', title: 'İki yeşil ucu birleştir', detail: 'Yeşil noktalar arasında ölçülebilir bir doğru parçası çiz.' };
      case 10:
        return { step: 'Son ölçüm', title: segmentAngleTitle, detail: `Doğru parçasının mor doğruyla yaptığı ${segmentAngleKind} açıyı derece olarak yaz.` };
      default:
        return { step: 'Görev', title: 'Sıradaki adım', detail: 'Ekrandaki parlayan hedefi takip et.' };
    }
  })();

  const handleNodeClick = (id: string, target: number, nLevel: number, nType: string) => {
    if (nLevel !== level) return;
    
    if (level === 1) {
        if (phase !== 1 && phase !== 2) return;
        if (phase === 1 && target !== 1) {
          setBotMsg({ id: Date.now(), text: "Önce mavi noktaları seçiyoruz. Mor noktalar bir sonraki adımda gelecek.", type: 'info' });
          return;
        }
        if (phase === 2 && target !== 2) {
          setBotMsg({ id: Date.now(), text: "Şimdi mor noktaları seçiyoruz; mavi doğru zaten çizildi.", type: 'info' });
          return;
        }
        
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
            setBotMsg({ id: Date.now(), text: "İlk doğru çizildi. Şimdi iki mor noktaya dokunup ikinci doğruyu çiz.", type: 'success' });
          } else if (phase === 2) {
            setLine2Drawn(true);
            setSelectedNodes([]);
            setPhase(3);
            setBotMsg({ id: Date.now(), text: "İki doğru kesişti. Şimdi karşı karşıya duran iki ters açıyı seç.", type: 'info' });
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
            setBotMsg({ id: Date.now(), text: `Işın çizildi. Şimdi iletkiyle ışının mavi doğruyla yaptığı ${rayAngleKind} açıyı ölç.`, type: 'success' });
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
            setBotMsg({ id: Date.now(), text: `Doğru parçası başarıyla bağlandı. İletkiyle bu doğru parçasının mor doğruyla yaptığı ${segmentAngleKind} açıyı ölç.`, type: 'success' });
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
            setAngleMeasureKind(has1And2 ? 'ACUTE' : 'OBTUSE');
            setBotMsg({ id: Date.now(), text: "Doğru seçim. Karşı karşıya duran ters açılar birbirine eşittir. Şimdi seçtiğin açıyı ölç.", type: 'success' });
            setTimeout(() => setPhase(4), 4500); // Protractor ekranına geç
        } else {
            setBotMsg({ id: Date.now(), text: "Bu iki açı yan yana, yani komşu. Ters açı için karşı karşıya duran iki alanı seçmelisin.", type: 'error' });
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
      if (dynamicShapes) {
        if (phase === 10) {
          setPPos({ x: dynamicShapes.segment.x2, y: dynamicShapes.segment.y2 });
          setPRot(dynamicShapes.p9Rot);
        } else if (phase === 7) {
          setPPos({ x: dynamicShapes.cx, y: dynamicShapes.cy });
          setPRot(dynamicShapes.p6Rot);
        } else {
          setPPos({ x: dynamicShapes.cx, y: dynamicShapes.cy });
          setPRot(dynamicShapes.p4Rot);
        }
      } else {
        setPPos({ x: 400, y: 300 });
        setPRot(0);
      }
      setProtractorPlaced(true);
      setBotMsg({ id: Date.now(), text: "İletki açı köşesine yerleşti. Gerekirse ortasından taşıyabilir, sağdaki tutacakla döndürebilirsin.", type: 'info' });
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
      const target = (angleMeasureKind === 'OBTUSE' ? 180 - dynamicShapes.targetAngle : dynamicShapes.targetAngle).toString();
      if (angleInputValue.trim() === target) {
        setBotMsg({ id: Date.now(), text: `Tam isabet. Açı ${target}°. Ters açı da aynı ölçüdedir. Şimdi Işın aracını seç.`, type: 'success' });
        setTimeout(() => {
          setProtractorPlaced(false);
          setAngleInputValue('');
          setLevel(2);
          setPhase(5);
          setSelectedNodes([]);
          setActiveTool('NONE');
        }, 3500);
      } else {
        handleAngleError(target, angleInputValue.trim(), `Hatalı Okuma!`);
      }
    } else if (phase === 7) {
      const target = dynamicShapes.rayAngleText.toString();
      if (angleInputValue.trim() === target) {
        setBotMsg({ id: Date.now(), text: `Harika, ${target}° doğru. Şimdi Doğru parçası aracını seçip iki uç arasında çizim yapacağız.`, type: 'success' });
        setTimeout(() => {
          setProtractorPlaced(false);
          setAngleInputValue('');
          setLevel(3);
          setPhase(8);
          setSelectedNodes([]);
          setActiveTool('NONE');
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
            unlockAtom('MAT.5.3.1.2');
            unlockAtom('MAT.5.3.1.3');
            unlockAtom('MAT.5.3.3.1');
            unlockAtom('MAT.5.3.4.1');
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
              <Spline className="w-6 h-6 text-[#00E5FF]" /> DOĞRU-IŞIN <span className="text-[#00E5FF]">ÇİZİMİ</span>
            </h1>
            <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Doğru, ışın, doğru parçası ve açı ölçme</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6 relative z-20 pb-40">
        
        {/* Sol Menü: Araçlar & Terminal */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-[#12121A]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Çizim araçları</h3>
             
             <button onClick={() => handleToolSelect('LINE')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'LINE' ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-full h-0.5 bg-current relative">
                      <div className="absolute -left-1 -top-1 border-t border-r border-current w-2 h-2 -rotate-45"></div>
                      <div className="absolute -right-1 -top-1 border-t border-r border-current w-2 h-2 rotate-45"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Doğru</span><span className="block text-[10px] opacity-70">İki yöne uzar</span></div>
             </button>

             <button onClick={() => handleToolSelect('RAY')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'RAY' ? 'bg-[#B388FF]/10 border-[#B388FF] text-[#B388FF]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-6 h-0.5 bg-current relative ml-2">
                       <div className="absolute -left-2 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                       <div className="absolute -right-1 -top-1 border-t border-r border-current w-2 h-2 rotate-45"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Işın</span><span className="block text-[10px] opacity-70">Bir noktadan başlar</span></div>
             </button>

             <button onClick={() => handleToolSelect('SEGMENT')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${ activeTool === 'SEGMENT' ? 'bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]' : 'bg-[#05050A] border-gray-800 text-gray-400 hover:border-gray-600' }`}
             >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-black/50">
                   <div className="w-6 h-0.5 bg-current relative">
                       <div className="absolute -left-1 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                       <div className="absolute -right-1 -top-[3px] w-1.5 h-1.5 bg-current rounded-full"></div>
                   </div>
                </div>
                <div className="text-left"><span className="block font-bold">Doğru parçası</span><span className="block text-[10px] opacity-70">İki uç arasında kalır</span></div>
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
            rayAngleKind={rayAngleKind}
            segmentAngleKind={segmentAngleKind}
          />
        </div>

        {/* Sağ Panel: Vektörel CAD Ekranı */}
        <div className="flex-1 w-full h-[500px] lg:h-auto bg-[#080B12] rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(0,229,255,0.05)] relative overflow-hidden flex items-center justify-center min-h-[500px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] to-transparent pointer-events-none"/>
            <div className="absolute left-4 right-4 top-4 z-20 rounded-2xl border border-[#00E5FF]/30 bg-[#06131D]/90 px-4 py-3 shadow-[0_0_30px_rgba(0,229,255,0.12)] backdrop-blur-xl">
              <div className="flex flex-col gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8DEFFF]">{currentGuide.step}</p>
                    <p className="text-base font-black text-white">{currentGuide.title}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug text-white/78">{currentGuide.detail}</p>
              </div>
            </div>

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

                    {phase === 3 && dynamicShapes && angleRegions.map((region, index) => {
                        const [origin, , farPoint] = region.points.split(' ').map((point) => {
                            const [x, y] = point.split(',').map(Number);
                            return { x, y };
                        });
                        const labelX = Math.min(760, Math.max(40, origin.x + (farPoint.x - origin.x) * 0.18));
                        const labelY = Math.min(540, Math.max(145, origin.y + (farPoint.y - origin.y) * 0.18));
                        const isSelected = selectedAngles.includes(region.id);

                        return (
                          <g key={`angle-label-${region.id}`} transform={`translate(${labelX}, ${labelY})`} className="cursor-pointer pointer-events-auto" onClick={() => handleAngleClick(region.id, region.type)}>
                            <circle r="20" fill={isSelected ? region.color : '#05050A'} stroke={region.color} strokeWidth="2" opacity={isSelected ? 0.95 : 0.86} />
                            <text x="0" y="5" textAnchor="middle" fill={isSelected ? '#05050A' : region.color} fontSize="16" fontWeight="900">
                              {String.fromCharCode(65 + index)}
                            </text>
                          </g>
                        );
                    })}

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

                        const nodeLabel = (() => {
                            if (!isTarget) return '';
                            if (level === 1) return phase === 1 ? 'mavi nokta' : 'mor nokta';
                            if (level === 2) return node.type === 'RAY_START' ? 'başlangıç' : 'yön';
                            return 'uç nokta';
                        })();

                        return (
                            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onClick={() => handleNodeClick(node.id, node.target, node.level, node.type)}>
                                <circle r="28" fill="transparent" className="cursor-pointer pointer-events-auto" />
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
                                {nodeLabel && (
                                  <g transform="translate(0, -34)" className="pointer-events-none">
                                    <rect x="-42" y="-14" width="84" height="22" rx="11" fill="#05050A" stroke={color} strokeWidth="1.5" opacity="0.9" />
                                    <text x="0" y="1" textAnchor="middle" fill={color} fontSize="10" fontWeight="900">
                                      {nodeLabel}
                                    </text>
                                  </g>
                                )}
                            </g>
                        )
                    })}

                    <Protractor placed={protractorPlaced} pPos={pPos} pRot={pRot} setActiveDrag={setActiveDrag} />

                    {phase === 7 && protractorPlaced && rayProtractorGuide && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35 }}
                        className="pointer-events-none"
                      >
                        <line
                          x1={rayProtractorGuide.x1}
                          y1={rayProtractorGuide.y1}
                          x2={rayProtractorGuide.x2}
                          y2={rayProtractorGuide.y2}
                          stroke="#FFF7D6"
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                        <line
                          x1={rayProtractorGuide.x1}
                          y1={rayProtractorGuide.y1}
                          x2={rayProtractorGuide.x2}
                          y2={rayProtractorGuide.y2}
                          stroke="#FF9F1C"
                          strokeWidth="6"
                          strokeLinecap="round"
                          style={{ filter: 'drop-shadow(0 0 12px rgba(255,159,28,1))' }}
                        />
                        <circle
                          cx={rayProtractorGuide.dotX}
                          cy={rayProtractorGuide.dotY}
                          r="14"
                          fill="#05050A"
                          stroke="#FFF7D6"
                          strokeWidth="4"
                        />
                        <circle
                          cx={rayProtractorGuide.dotX}
                          cy={rayProtractorGuide.dotY}
                          r="7"
                          fill="#FF9F1C"
                          style={{ filter: 'drop-shadow(0 0 10px rgba(255,159,28,1))' }}
                        />
                        <g transform={`translate(${rayProtractorGuide.labelX}, ${rayProtractorGuide.labelY})`}>
                          <rect x="-64" y="-18" width="128" height="36" rx="18" fill="#05050A" stroke="#FFB74D" strokeWidth="2" opacity="0.94" />
                          <text x="0" y="-2" textAnchor="middle" fill="#FFEDD5" fontSize="10" fontWeight="900" letterSpacing="2">
                            TURUNCU
                          </text>
                          <text x="0" y="12" textAnchor="middle" fill="#FF9F1C" fontSize="11" fontWeight="900">
                            IŞIN ÇİZGİSİ
                          </text>
                        </g>
                        <AngleReadingZoom
                          angle={rayProtractorGuide.zoomAngle}
                          x={rayProtractorGuide.zoomX}
                          y={rayProtractorGuide.zoomY}
                        />
                      </motion.g>
                    )}
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
                 ÇİZİM <span className="text-[#00FF88]">TAMAMLANDI!</span>
               </h2>
               <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                  Doğru, ışın ve doğru parçası çizdin; kesişen doğrularda ters açıları seçip iletkiyle ölçtün.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-black/50 border border-gray-800 p-5 rounded-2xl">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
                        <span className="font-mono text-[#00E5FF] font-bold text-xs uppercase tracking-wider">MAT.5.3.1.1 / 1.2 / 1.3</span>
                     </div>
                     <p className="text-white text-sm">Doğru, ışın ve doğru parçası çizimleri tamamlandı.</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-black/50 border border-gray-800 p-5 rounded-2xl">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#B388FF] animate-pulse"></div>
                        <span className="font-mono text-[#B388FF] font-bold text-xs uppercase tracking-wider">MAT.5.3.3.1 · MAT.5.3.4.1</span>
                     </div>
                     <p className="text-white text-sm">İletkiyle açı ölçümü ve ters açı ilişkisi keşfedildi.</p>
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

function AngleReadingZoom({ angle, x, y }: { angle: number; x: number; y: number }) {
  const start = Math.floor(angle / 5) * 5;
  const marks = Array.from({ length: 6 }, (_, index) => start + index);
  const pointerX = -90 + (angle - start) * 36;

  return (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
      <rect x="-122" y="-58" width="244" height="112" rx="20" fill="#05050A" stroke="#FFB74D" strokeWidth="2.5" opacity="0.96" />
      <rect x="-108" y="-42" width="216" height="74" rx="15" fill="#111827" stroke="#FFF7D6" strokeWidth="1.5" opacity="0.86" />
      <text x="0" y="-25" textAnchor="middle" fill="#FFEDD5" fontSize="10" fontWeight="900" letterSpacing="2">
        YAKIN OKUMA
      </text>
      <text x="0" y="-10" textAnchor="middle" fill="#FED7AA" fontSize="9" fontWeight="800">
        1° çizgilerini say
      </text>
      <line x1="-90" y1="18" x2="90" y2="18" stroke="#FFF7D6" strokeWidth="4" strokeLinecap="round" />
      {marks.map((mark, index) => {
        const markX = -90 + index * 36;
        const isEdge = index === 0 || index === marks.length - 1;

        return (
          <g key={mark}>
            <line x1={markX} y1={isEdge ? "-2" : "5"} x2={markX} y2="30" stroke={isEdge ? "#FFF7D6" : "#FED7AA"} strokeWidth={isEdge ? "4" : "2.5"} strokeLinecap="round" />
            {isEdge && (
              <text x={markX} y="45" textAnchor="middle" fill="#FFF7D6" fontSize="13" fontWeight="900">
                {mark}°
              </text>
            )}
          </g>
        );
      })}
      <line x1={pointerX} y1="-4" x2={pointerX} y2="32" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(255,159,28,1))' }} />
      <path d={`M ${pointerX - 9} -7 L ${pointerX + 9} -7 L ${pointerX} 5 Z`} fill="#FF9F1C" />
    </g>
  );
}
