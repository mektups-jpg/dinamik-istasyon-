import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { GameHeader } from '../../../components/ui/GameHeader';
import { Play, RotateCcw, Ruler, Scissors, ArrowRight, Activity, Disc, SquareActivity } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

type PiChoiceId = '2' | '3.14' | '6.28';
type UnitScale = 'base' | 'ten';

type CircleFeedback = {
    kind: 'info' | 'success' | 'error';
    title: string;
    text: string;
} | null;

const PI_CHOICES: Array<{ id: PiChoiceId; label: string; feedback: string }> = [
    {
        id: '2',
        label: '2',
        feedback: '2 sayısı çapın yarıçapa oranıdır. Biz çevreyi çapa bölüyoruz.'
    },
    {
        id: '3.14',
        label: '3,14',
        feedback: 'Doğru. Tekerleğin bir turda aldığı yol çevredir; çevreyi çapa bölersek yaklaşık 3,14 çıkar.'
    },
    {
        id: '6.28',
        label: '6,28',
        feedback: '6,28 yaklaşık 2π olur. Bu değer çevre / yarıçap oranına daha yakındır.'
    }
];

export default function AreaPiApp() {
    const { showMessage } = useAstroBotStore();
    const { unlockAtom, unlockModule } = useAtomStore();
    const { addScore } = useGameStore();
    
    const [activeTab, setActiveTab] = useState<'polygon' | 'circle'>('polygon');
    
    // Polygon State
    const [shapeType, setShapeType] = useState<'rectangle' | 'triangle' | 'parallelogram'>('rectangle');
    const [base, setBase] = useState<number>(6);
    const [height, setHeight] = useState<number>(4);
    const [unitScale, setUnitScale] = useState<UnitScale>('base');
    
    // Circle State
    const [radius, setRadius] = useState<number>(3);
    const [isRolling, setIsRolling] = useState(false);
    const [rollProgress, setRollProgress] = useState(0); // 0 to 1
    const [targetAngle, setTargetAngle] = useState<number>(90);
    const [showArc, setShowArc] = useState(false);
    const [piUnlocked, setPiUnlocked] = useState(false);
    const [selectedPiChoice, setSelectedPiChoice] = useState<PiChoiceId | null>(null);
    const [circleFeedback, setCircleFeedback] = useState<CircleFeedback>(null);

    useEffect(() => {
        if (activeTab === 'polygon') {
            showMessage("Çokgen laboratuvarına hoş geldin! Dikdörtgeni keserek formülün nasıl ortaya çıktığını gözlemle.", "info");
        } else {
            showMessage("Çemberde Pi keşfi: Tekerleği bir tur yuvarla, aldığı yolu çapa böl ve yaklaşık oranı seç.", "info");
        }
    }, [activeTab, showMessage]);

    useEffect(() => {
        if (activeTab !== 'polygon') return;

        if (unitScale === 'ten') {
            unlockAtom('MAT.6.4.1.1');
        }

        if (shapeType === 'triangle') {
            unlockAtom('MAT.6.4.2.1');
        }

        if (shapeType === 'parallelogram') {
            unlockAtom('MAT.6.4.2.2');
            unlockAtom('MAT.6.4.3.1');
        }
    }, [activeTab, shapeType, unitScale, unlockAtom]);

    // Handle Circle Roll Animation
    useEffect(() => {
        let animationFrame: number;
        if (isRolling) {
            let start = Date.now();
            const duration = 2000;
            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - start) / duration, 1);
                // Easing out
                const eased = 1 - Math.pow(1 - progress, 3);
                setRollProgress(eased);
                
                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setIsRolling(false);
                    setCircleFeedback({
                        kind: 'info',
                        title: 'İz tamamlandı',
                        text: `Sarı iz tekerleğin bir turda aldığı yolu, yani çevreyi gösterir. Çap ${radius * 2} birim; şimdi çevreyi çapa bölelim.`
                    });
                    showMessage(`Tekerlek tam tur döndü. Çevre uzunluğu ${(2 * Math.PI * radius).toFixed(2)} birim. Çevreyi çapa böl: yaklaşık kaç çıkar?`, "info");
                }
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isRolling, radius, showMessage]);

    const handleRollStart = () => {
        setRollProgress(0);
        setIsRolling(true);
        setShowArc(false);
        setPiUnlocked(false);
        setSelectedPiChoice(null);
        setCircleFeedback(null);
        showMessage("Tekerlek yuvarlanıyor. Bir tur tamamlanınca aldığı yol çevre olacak.", "info");
    };

    const handleReset = () => {
        setRollProgress(0);
        setShowArc(false);
        setTargetAngle(90);
        setPiUnlocked(false);
        setSelectedPiChoice(null);
        setCircleFeedback(null);
    };

    const handlePiChoice = (choiceId: PiChoiceId) => {
        setSelectedPiChoice(choiceId);
        const selectedChoice = PI_CHOICES.find((choice) => choice.id === choiceId);

        if (rollProgress < 1) {
            setCircleFeedback({
                kind: 'info',
                title: 'Önce deneyi tamamla',
                text: 'Tekerlek bir tam tur yuvarlanınca çevre uzunluğunu göreceğiz.'
            });
            showMessage("Önce tekerleği bir tam tur yuvarlayalım; sonra oranı seçelim.", "info");
            return;
        }

        if (choiceId === '3.14') {
            setPiUnlocked(true);
            setShowArc(true);
            setTargetAngle(90);
            setCircleFeedback({
                kind: 'success',
                title: 'Pi oranı bulundu',
                text: selectedChoice?.feedback ?? 'Çevreyi çapa bölersek yaklaşık 3,14 çıkar.'
            });
            showMessage("Doğru hedef: Çevreyi çapa böldüğümüzde yaklaşık 3,14 sayısına ulaşırız.", "success");
            if (!piUnlocked) {
                addScore(250);
                unlockAtom('MAT.6.4.4.1');
                unlockAtom('MAT.6.4.5.1');
                unlockAtom('MAT.6.4.6.1');
                unlockModule('area-pi-lab');
            }
            return;
        }

        setPiUnlocked(false);
        setShowArc(false);
        setCircleFeedback({
            kind: 'error',
            title: 'Neden yanlış?',
            text: selectedChoice?.feedback ?? 'Bu oran çevre / çap ilişkisini anlatmaz.'
        });
        showMessage(`Neden yanlış? ${selectedChoice?.feedback ?? 'Bu oran çevre / çap ilişkisini anlatmaz.'}`, "error");
    };

    // Calculate actual dimensions for drawing
    const scale = 20; // pixels per unit
    const unitFactor = unitScale === 'ten' ? 10 : 1;
    const displayBase = base * unitFactor;
    const displayHeight = height * unitFactor;
    const displayArea = displayBase * displayHeight;
    const unitLabel = 'br';
    
    const renderPolygonArea = () => {
        const drawW = base * scale;
        const drawH = height * scale;
        const slant = Math.min(drawH * 0.45, drawW * 0.35, 70);

        return (
            <div className="flex-1 flex xl:flex-row flex-col w-full max-w-6xl gap-6 items-stretch">
                <div className="relative flex-1 min-h-[400px] bg-[#0f172a] rounded-xl border-2 border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50 blur-[0.5px]"></div>

                    <svg width="100%" height="100%" viewBox="-200 -150 400 300" className="overflow-visible filter drop-shadow-lg">
                        <defs>
                            <marker id="area-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
                                <path d="M 0 0 L 8 4 L 0 8 z" fill="#a7f3d0" />
                            </marker>
                        </defs>
                        {/* Base ruler */}
                        <line x1={-drawW/2} y1={drawH/2 + 20} x2={drawW/2} y2={drawH/2 + 20} stroke="#64748b" strokeWidth="2" />
                        <text x={0} y={drawH/2 + 40} fill="#94a3b8" fontSize="14" textAnchor="middle" className="font-mono">Taban: {displayBase} {unitLabel}</text>
                        
                        {/* Height ruler */}
                        <line x1={-drawW/2 - 20} y1={-drawH/2} x2={-drawW/2 - 20} y2={drawH/2} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                        <text x={-drawW/2 - 35} y={0} fill="#94a3b8" fontSize="14" textAnchor="middle" transform={`rotate(-90, ${-drawW/2 - 35}, 0)`} className="font-mono">Yükseklik: {displayHeight} {unitLabel}</text>

                        <AnimatePresence mode="popLayout">
                            {shapeType === 'rectangle' && (
                                <motion.g
                                    key="rect"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                >
                                    <rect x={-drawW/2} y={-drawH/2} width={drawW} height={drawH} fill="#3b82f6" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="3" />
                                </motion.g>
                            )}

                            {shapeType === 'triangle' && (
                                <motion.g
                                    key="tri-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Ghost of rect */}
                                    <rect x={-drawW/2} y={-drawH/2} width={drawW} height={drawH} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                                    
                                    {/* Left Triangle (kept) */}
                                    <motion.polygon 
                                        points={`${-drawW/2},${drawH/2} ${drawW/2},${drawH/2} ${-drawW/2},${-drawH/2}`}
                                        fill="#f43f5e" fillOpacity="0.6" stroke="#fb7185" strokeWidth="3"
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 1 }}
                                    />
                                    {/* Right Triangle (discarded smoothly) */}
                                    <motion.polygon 
                                        points={`${drawW/2},${drawH/2} ${drawW/2},${-drawH/2} ${-drawW/2},${-drawH/2}`}
                                        fill="#f43f5e" fillOpacity="0.2" stroke="#fb7185" strokeWidth="3" strokeDasharray="5 5"
                                        initial={{ x: 0, y: 0, opacity: 1 }}
                                        animate={{ x: 50, y: -50, opacity: 0, rotate: 15 }}
                                        transition={{ duration: 1.2, delay: 0.5 }}
                                    />
                                </motion.g>
                            )}

                            {shapeType === 'parallelogram' && (
                                <motion.g
                                    key="para-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Original parallelogram reference */}
                                    <polygon 
                                        points={`${-drawW/2 + slant},${-drawH/2} ${drawW/2 + slant},${-drawH/2} ${drawW/2},${drawH/2} ${-drawW/2},${drawH/2}`}
                                        fill="#10b981"
                                        fillOpacity="0.12"
                                        stroke="#94a3b8"
                                        strokeWidth="2"
                                        strokeDasharray="6 6"
                                        opacity="0.65"
                                    />

                                    {/* Rectangle target after moving the cut triangle */}
                                    <rect
                                        x={-drawW/2 + slant}
                                        y={-drawH/2}
                                        width={drawW}
                                        height={drawH}
                                        fill="none"
                                        stroke="#a7f3d0"
                                        strokeWidth="2"
                                        strokeDasharray="8 5"
                                        opacity="0.45"
                                    />

                                    {/* Main body after the left triangle is cut */}
                                    <polygon 
                                        points={`${-drawW/2 + slant},${-drawH/2} ${drawW/2 + slant},${-drawH/2} ${drawW/2},${drawH/2} ${-drawW/2 + slant},${drawH/2}`}
                                        fill="#10b981" fillOpacity="0.5" stroke="#34d399" strokeWidth="3" strokeLinejoin="round"
                                    />

                                    {/* Faint starting position of the cut triangle */}
                                    <polygon
                                        points={`${-drawW/2 + slant},${-drawH/2} ${-drawW/2 + slant},${drawH/2} ${-drawW/2},${drawH/2}`}
                                        fill="#10b981"
                                        fillOpacity="0.14"
                                        stroke="#34d399"
                                        strokeWidth="2"
                                        strokeDasharray="5 4"
                                        strokeLinejoin="round"
                                    />

                                    {/* Cut piece moved once to the right: same triangle completes a rectangle */}
                                    <motion.polygon
                                        points={`${-drawW/2 + slant},${-drawH/2} ${-drawW/2 + slant},${drawH/2} ${-drawW/2},${drawH/2}`}
                                        fill="#10b981" fillOpacity="0.8" stroke="#34d399" strokeWidth="3" strokeLinejoin="round"
                                        initial={{ x: 0 }}
                                        animate={{ x: drawW }}
                                        transition={{ duration: 3.4, ease: "easeInOut" }}
                                    />

                                    <motion.g
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <line
                                            x1={-drawW/2 + slant + 12}
                                            y1={drawH/2 + 10}
                                            x2={drawW/2 + slant - 12}
                                            y2={drawH/2 + 10}
                                            stroke="#a7f3d0"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            markerEnd="url(#area-arrow)"
                                        />
                                        <text x={slant} y={-drawH/2 - 14} fill="#a7f3d0" fontSize="10" textAnchor="middle" className="font-mono font-bold">
                                            Üçgen sağa taşınır
                                        </text>
                                    </motion.g>
                                </motion.g>
                            )}
                        </AnimatePresence>
                    </svg>
                </div>

                {/* Right Panel */}
                <div className="xl:w-96 w-full shrink-0 flex flex-col gap-4">
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-600 shadow-xl backdrop-blur-sm">
                        <div className="text-sm font-bold text-[#00FF88] mb-3 border-b border-slate-600 pb-2">Alan İspatı</div>
                        <div className="text-sm space-y-4">
                            {shapeType === 'rectangle' && (
                                <>
                                    <BlockMath math={`A = a \\times h`} />
                                    <div className="rounded-lg bg-slate-900/60 px-3 py-2 text-center font-mono text-sm font-bold leading-relaxed text-slate-100">
                                        A = {displayBase} x {displayHeight} = {displayArea} {unitLabel}²
                                    </div>
                                </>
                            )}
                            {shapeType === 'triangle' && (
                                <>
                                    <BlockMath math={`A = \\frac{a \\times h}{2}`} />
                                    <div className="rounded-lg bg-slate-900/60 px-3 py-2 text-center font-mono text-sm font-bold leading-relaxed text-slate-100">
                                        A = ({displayBase} x {displayHeight}) ÷ 2 = {displayArea / 2} {unitLabel}²
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 italic text-center bg-slate-900/50 p-2 rounded">Dikdörtgenin tam yarısı!</div>
                                </>
                            )}
                            {shapeType === 'parallelogram' && (
                                <>
                                    <BlockMath math={`A = a \\times h`} />
                                    <div className="rounded-lg bg-slate-900/60 px-3 py-2 text-center font-mono text-sm font-bold leading-relaxed text-slate-100">
                                        A = {displayBase} x {displayHeight} = {displayArea} {unitLabel}²
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 italic text-center bg-slate-900/50 p-2 rounded">Dikdörtgen ile aynı alan!</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Polygon Controls */}
                    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 flex flex-col gap-6 shadow-md backdrop-blur-md flex-1">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 block">Şekil Formu</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setShapeType('rectangle')} className={`flex-1 py-2 px-1 rounded-md text-sm font-semibold transition-colors ${shapeType === 'rectangle' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Dikdörtgen</button>
                                    <button onClick={() => setShapeType('triangle')} className={`flex-1 py-2 px-1 rounded-md text-sm font-semibold transition-colors ${shapeType === 'triangle' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Üçgen <Scissors className="w-3 h-3 inline ml-1"/></button>
                                    <button onClick={() => setShapeType('parallelogram')} className={`flex-1 py-2 px-1 rounded-md text-sm font-semibold transition-colors ${shapeType === 'parallelogram' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Paralelk.. <ArrowRight className="w-3 h-3 inline ml-1"/></button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 flex justify-between">Taban <span>{base}</span></label>
                                    <input type="range" min="3" max="10" value={base} onChange={(e) => setBase(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 flex justify-between">Yükseklik <span>{height}</span></label>
                                    <input type="range" min="2" max="8" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 block">Ölçek Karşılaştırması</label>
                            <div className="flex bg-slate-700 rounded-lg p-1 w-full">
                                <button onClick={() => setUnitScale('base')} className={`flex-1 py-1.5 text-xs font-bold rounded ${unitScale === 'base' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>1x ölçü</button>
                                <button onClick={() => setUnitScale('ten')} className={`flex-1 py-1.5 text-xs font-bold rounded ${unitScale === 'ten' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>10x ölçü</button>
                            </div>
                            {unitScale === 'ten' && (
                                <div className="mt-3 text-[10px] text-amber-400 leading-tight">
                                    Taban ve yükseklik 10 kat olunca alan <strong className="text-amber-300 text-xs">100 kat (10²)</strong> olur: {base * height} br² → {displayArea} br².
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCirclePi = () => {
        const circum = 2 * Math.PI * radius;
        const diameter = radius * 2;
        const piRatio = circum / diameter;
        // Total track width roughly 800px.
        const cScale = 18; 
        const visualRadius = radius * cScale;
        const visualCircum = circum * cScale;
        const rollStartX = -300;
        const currentX = rollStartX + (rollProgress * visualCircum);
        const currentRotation = rollProgress * 360;
        const targetAngleRatio = targetAngle / 360;
        const targetAngleRadians = targetAngle * Math.PI / 180;
        const arcEndX = visualRadius * Math.sin(targetAngleRadians);
        const arcEndY = -visualRadius * Math.cos(targetAngleRadians);
        const arcLength = circum * targetAngleRatio;
        const isLargeArc = targetAngle > 180 ? 1 : 0;
        const isFullCircleArc = targetAngle >= 360;
        const fullCirclePath = `M 0 ${-visualRadius} A ${visualRadius} ${visualRadius} 0 1 1 0 ${visualRadius} A ${visualRadius} ${visualRadius} 0 1 1 0 ${-visualRadius}`;
        const sectorPath = isFullCircleArc
            ? `${fullCirclePath} Z`
            : `M 0 0 L 0 ${-visualRadius} A ${visualRadius} ${visualRadius} 0 ${isLargeArc} 1 ${arcEndX} ${arcEndY} Z`;
        const arcEdgePath = isFullCircleArc
            ? fullCirclePath
            : `M 0 ${-visualRadius} A ${visualRadius} ${visualRadius} 0 ${isLargeArc} 1 ${arcEndX} ${arcEndY}`;

        return (
            <div className="flex-1 flex xl:flex-row flex-col w-full max-w-6xl gap-6 items-stretch">
                <div className="relative flex-1 min-h-[400px] bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] rounded-xl border-2 border-indigo-500/30 shadow-inner flex items-center justify-center overflow-hidden">
                    
                    <svg width="100%" height="100%" viewBox="-400 -150 800 300" className="overflow-visible">
                        {/* Floor */}
                        <line x1="-800" y1={visualRadius} x2="800" y2={visualRadius} stroke="#4f46e5" strokeWidth="2" strokeOpacity="0.5" />
                        
                        {/* Start and expected end lines */}
                        <line x1={rollStartX} y1={visualRadius-10} x2={rollStartX} y2={visualRadius+20} stroke="#94a3b8" strokeWidth="2" />
                        <text x={rollStartX} y={visualRadius+35} fill="#94a3b8" fontSize="12" textAnchor="middle">Başlangıç</text>

                        {/* Paint Trace line */}
                        {rollProgress > 0 && (
                            <motion.line 
                                x1={rollStartX} y1={visualRadius} 
                                x2={currentX} y2={visualRadius} 
                                stroke="#facc15" strokeWidth="4" 
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                            />
                        )}

                        {/* End marker visible only when near end */}
                        <motion.g animate={{ opacity: rollProgress > 0.9 ? 1 : 0 }}>
                            <line x1={rollStartX + visualCircum} y1={visualRadius-10} x2={rollStartX + visualCircum} y2={visualRadius+20} stroke="#facc15" strokeWidth="2" strokeDasharray="3 3"/>
                            <text x={rollStartX + visualCircum} y={visualRadius+35} fill="#facc15" fontSize="12" textAnchor="middle" className="font-bold font-mono">1 Tur (Çevre)</text>
                        </motion.g>

                        {/* The Wheel */}
                        <motion.g
                            animate={{ x: currentX, rotate: currentRotation }}
                            transition={{ ease: "linear", duration: 0 }}
                        >
                            {/* Fill */}
                            <circle cx="0" cy="0" r={visualRadius} fill="#1e1b4b" fillOpacity="0.8" stroke="#818cf8" strokeWidth="3" />
                            {/* Inner dot */}
                            <circle cx="0" cy="0" r="4" fill="#a5b4fc" />
                            {/* Spokes to show rotation clearly */}
                            <line x1="0" y1="0" x2={0} y2={visualRadius} stroke="#facc15" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="0" y1="0" x2={0} y2={-visualRadius} stroke="#4f46e5" strokeWidth="2" />
                            <line x1="0" y1="0" x2={visualRadius} y2="0" stroke="#4f46e5" strokeWidth="2" />
                            <line x1="0" y1="0" x2={-visualRadius} y2="0" stroke="#4f46e5" strokeWidth="2" />

                            {showArc && rollProgress === 1 && piUnlocked && (
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.88 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <path
                                        d={sectorPath}
                                        fill="#ec4899"
                                        fillOpacity="0.55"
                                        stroke="#f9a8d4"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d={arcEdgePath}
                                        fill="none"
                                        stroke="#fdf2f8"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <line x1="0" y1="0" x2="0" y2={-visualRadius} stroke="#fdf2f8" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="0" y1="0" x2={arcEndX} y2={arcEndY} stroke="#fdf2f8" strokeWidth="1.5" strokeLinecap="round" />
                                    <text
                                        x={visualRadius * 0.42}
                                        y={-visualRadius * 0.33}
                                        fill="#ffffff"
                                        fontSize="12"
                                        textAnchor="middle"
                                        className="font-bold"
                                    >
                                        {targetAngle}°
                                    </text>
                                </motion.g>
                            )}
                            
                            {/* Radius text label, stays horizontal roughly by inverse rotation if needed, but since it's rotating, we just put it on the wheel */}
                        </motion.g>
                    </svg>
                </div>

                {/* Right Panel */}
                <div className="xl:w-96 w-full shrink-0 flex flex-col gap-4">
                    <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/50 backdrop-blur-md shadow-lg shadow-indigo-500/10">
                        <div className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2 border-b border-indigo-500/30 pb-2">
                            <Activity className="w-4 h-4"/> Pi Keşfi: Çevreyi Çapa Böl
                        </div>
                        <div className="text-sm space-y-3 text-slate-200">
                            <div className="rounded-lg border border-indigo-400/25 bg-indigo-950/25 p-3">
                                <div className="text-xs uppercase tracking-[0.18em] text-indigo-200/80">Ölçü bilgisi</div>
                                <div className="mt-2 space-y-1.5 leading-relaxed">
                                    <p><span className="font-bold text-indigo-100">Çap (d):</span> 2 x r = {diameter} br</p>
                                    <p><span className="font-bold text-yellow-200">Çevre izi (C):</span> {rollProgress === 1 ? `${circum.toFixed(2)} br` : 'Bir turdan sonra ölçülecek'}</p>
                                </div>
                            </div>

                            {rollProgress < 1 && (
                                <div className="rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-3 text-yellow-100">
                                    Önce tekerleği bir tur yuvarla. Sarı iz oluşunca çevreyi çapa bölüp oranı seçeceksin.
                                </div>
                            )}

                            {rollProgress === 1 && (
                                <div className="rounded-xl border border-slate-600 bg-slate-950/60 p-3">
                                    <div className="text-sm font-black leading-snug text-cyan-100">Çevreyi çapa böl: yaklaşık kaç çıkar?</div>
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {PI_CHOICES.map((choice) => {
                                            const isSelected = selectedPiChoice === choice.id;
                                            const isCorrect = choice.id === '3.14';
                                            const selectedStyle = isSelected
                                                ? isCorrect
                                                    ? 'border-emerald-300 bg-emerald-400/25 text-emerald-50 shadow-emerald-400/20'
                                                    : 'border-rose-300 bg-rose-400/20 text-rose-50 shadow-rose-400/20'
                                                : 'border-white/10 bg-slate-800 text-white hover:border-cyan-300/70 hover:bg-cyan-400/10';

                                            return (
                                                <button
                                                    key={choice.id}
                                                    onClick={() => handlePiChoice(choice.id)}
                                                    className={`rounded-lg border px-3 py-2 text-lg font-black shadow-lg transition-all ${selectedStyle}`}
                                                >
                                                    {choice.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {circleFeedback && (
                                <div className={`rounded-lg border p-3 text-sm ${
                                    circleFeedback.kind === 'success'
                                        ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-50'
                                        : circleFeedback.kind === 'error'
                                            ? 'border-rose-400/50 bg-rose-500/15 text-rose-50'
                                            : 'border-cyan-400/40 bg-cyan-500/10 text-cyan-50'
                                }`}>
                                    <div className="font-bold">{circleFeedback.title}</div>
                                    <div className="mt-1 leading-relaxed">{circleFeedback.text}</div>
                                </div>
                            )}

                            {piUnlocked && (
                                <>
                                    <div className="bg-emerald-900/40 p-2 rounded-lg border border-emerald-500/30 mt-2">
                                        <BlockMath math={`\\pi = \\frac{C}{d} \\approx ${piRatio.toFixed(5)}`} />
                                    </div>
                                    <div className="text-xs text-slate-300 italic text-center">Çember büyüse de çevreyi çapa bölünce çıkan oran hep yaklaşık <InlineMath math="3{,}14"/> kalır.</div>
                                </>
                            )}
                        </div>

                        {showArc && rollProgress === 1 && piUnlocked && (
                            <div className="mt-4 pt-3 border-t border-indigo-500/30">
                                <div className="text-xs font-bold text-pink-300 mb-2 flex items-center gap-2">
                                    <Disc className="w-3 h-3"/> {targetAngle} derecelik yay ne kadar?
                                </div>
                                <div className="space-y-2 rounded-lg border border-pink-400/30 bg-pink-950/30 p-3 text-sm text-pink-50">
                                    <p>
                                        {targetAngle}° merkez açı, tam çemberin 360 derecesinden{' '}
                                        <span className="font-black text-white">{targetAngle} derecelik</span>{' '}
                                        parçayı gösterir.
                                    </p>
                                    <div className="rounded-md bg-slate-950/60 px-3 py-2 font-mono text-base font-black text-white">
                                        Yay = {circum.toFixed(2)} × {targetAngle} ÷ 360 = {arcLength.toFixed(2)} br
                                    </div>
                                    {targetAngle === 90 && (
                                        <p className="text-pink-100/90">
                                            90° bir çemberin dörtte biridir. Bu yüzden yay, çevrenin dörtte biri kadar olur.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Circle Controls */}
                    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 flex flex-col gap-6 shadow-md backdrop-blur-md flex-1">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 flex justify-between">
                                    Tekerlek Yarıçapı (r) <span className="text-indigo-400 font-mono">{radius} br</span>
                                </label>
                                <input 
                                    type="range" min="1" max="6" step="0.5" 
                                    value={radius} 
                                    onChange={(e) => {
                                        setRadius(parseFloat(e.target.value));
                                        handleReset();
                                    }} 
                                    disabled={isRolling}
                                    className="w-full accent-indigo-500 py-2" 
                                />
                            </div>
                        </div>
                        
                        {rollProgress === 1 && piUnlocked && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col justify-center"
                            >
                                <label className="text-xs text-pink-400 uppercase font-bold tracking-wider mb-1 flex justify-between">
                                    Merkez Açı (Yay) <span className="font-mono text-white">{targetAngle}°</span>
                                </label>
                                <input 
                                    type="range" min="10" max="360" step="10" 
                                    value={targetAngle} 
                                    onChange={(e) => {
                                        setTargetAngle(parseFloat(e.target.value));
                                        setShowArc(true);
                                    }} 
                                    className="w-full accent-pink-500" 
                                />
                            </motion.div>
                        )}

                        <div className="flex-1 flex flex-col justify-end">
                            {rollProgress < 1 ? (
                                <button 
                                    onClick={handleRollStart}
                                    disabled={isRolling}
                                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${isRolling ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'}`}
                                >
                                    <Play className="w-4 h-4" /> Bir Tur Yuvarla
                                </button>
                            ) : (
                                <button 
                                    onClick={handleReset}
                                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold bg-slate-600 text-white hover:bg-slate-500 transition-all"
                                >
                                    <RotateCcw className="w-4 h-4" /> Deneyi Sıfırla
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-[#05050A] text-white overflow-y-auto overflow-x-hidden relative selection:bg-[#B388FF]/30 flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,184,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,184,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]"></div>
            </div>

            <GameHeader 
              title="GEOMETRİK ALAN VE Pİ LABORATUVARI" 
              subtitle="MAT.6.4.X KAZANIMLARI" 
            />

            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col pb-8">
                {/* Header Tabs */}
                <div className="flex w-full max-w-fit mx-auto bg-slate-800/80 backdrop-blur-md p-1.5 rounded-full border border-slate-700/50 shadow-xl mb-6">
                    <button
                        onClick={() => setActiveTab('polygon')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all relative ${
                            activeTab === 'polygon' ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        {activeTab === 'polygon' && (
                            <motion.div layoutId="activeTabBadge" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" style={{ zIndex: 0 }} />
                        )}
                        <SquareActivity className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Çokgen Alan İspatı</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('circle')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all relative ${
                            activeTab === 'circle' ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        {activeTab === 'circle' && (
                            <motion.div layoutId="activeTabBadge" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ zIndex: 0 }} />
                        )}
                        <Disc className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Pi: Çevreyi Çapa Böl</span>
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col items-center justify-start w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm"
                    >
                        {activeTab === 'polygon' ? renderPolygonArea() : renderCirclePi()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
