import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useGameStore } from '../../../store/useGameStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Minus, Plus, Ruler, Target, Triangle } from 'lucide-react';
import { GameHeader } from '../../../components/ui/GameHeader';

const MIN_SIDE = 1;
const MAX_SIDE = 15;

type SideKey = 'A' | 'B' | 'C';

const getTriangleType = (a: number, b: number, c: number) => {
    if (a + b <= c || a + c <= b || b + c <= a) return 'INVALID';
    if (a === b && b === c) return 'EQUILATERAL';
    if (a === b || a === c || b === c) return 'ISOSCELES';
    return 'SCALENE';
};

const clampSide = (value: number) => Math.min(MAX_SIDE, Math.max(MIN_SIDE, value));

function LengthControl({
  label,
  value,
  color,
  onDecrease,
  onIncrease,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (value: number) => void;
}) {
  const percent = ((value - MIN_SIDE) / (MAX_SIDE - MIN_SIDE)) * 100;

  return (
    <div className="relative z-10 rounded-2xl border border-white/10 bg-black/22 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-200">
          <Ruler className="h-4 w-4" style={{ color }} />
          {label}
        </h3>
        <span className="rounded-full border px-3 py-1 font-mono text-sm font-black" style={{ borderColor: `${color}66`, color }}>
          {value} U
        </span>
      </div>

      <div className="grid grid-cols-[52px_minmax(0,1fr)_52px] items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= MIN_SIDE}
          aria-label={`${label} uzunluğunu azalt`}
          className="grid h-12 place-items-center rounded-2xl border bg-white/[0.04] text-white transition hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-35"
          style={{ borderColor: `${color}55` }}
        >
          <Minus className="h-5 w-5" />
        </button>

        <div>
          <input
            aria-label={`${label} uzunluğu`}
            type="range"
            min={MIN_SIDE}
            max={MAX_SIDE}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-3 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
            style={{ accentColor: color }}
          />
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onIncrease}
          disabled={value >= MAX_SIDE}
          aria-label={`${label} uzunluğunu artır`}
          className="grid h-12 place-items-center rounded-2xl border bg-white/[0.04] text-white transition hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-35"
          style={{ borderColor: `${color}55` }}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function PolygonCollisionApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const { showMessage } = useAstroBotStore();

  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState(8);

  const [phase, setPhase] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [typesFound, setTypesFound] = useState({ EQUILATERAL: false, ISOSCELES: false, SCALENE: false });

  const currentType = getTriangleType(a, b, c);
  const isValid = currentType !== 'INVALID';
  const sideControls = useMemo(
    () => [
      { key: 'A' as const, name: 'Kırmızı', value: a, color: '#FF3366' },
      { key: 'B' as const, name: 'Mavi', value: b, color: '#33CCFF' },
      { key: 'C' as const, name: 'Yeşil', value: c, color: '#00FF88' },
    ],
    [a, b, c]
  );
  const sortedSides = useMemo(
    () => [...sideControls].sort((left, right) => left.value - right.value),
    [sideControls]
  );
  const shortSides = sortedSides.slice(0, 2);
  const longestSide = sortedSides[2];
  const shortSum = shortSides[0].value + shortSides[1].value;
  const closingNeed = Math.max(0, longestSide.value - shortSum + 1);
  const isFlatLine = !isValid && shortSum === longestSide.value;
  const statusHeadline = isValid
    ? 'Üçgen kapanıyor'
    : isFlatLine
      ? 'Tam düz çizgi oldu'
      : 'Üçgen kapanmadı';
  const statusCopy = isValid
    ? `${shortSides[0].key} + ${shortSides[1].key} = ${shortSum}. En uzun ${longestSide.key} = ${longestSide.value}. ${shortSum} > ${longestSide.value}, bu yüzden uçlar birleşir.`
    : isFlatLine
      ? `${shortSides[0].key} + ${shortSides[1].key} = ${shortSum}. Üçgen için bu toplam ${longestSide.key}'den büyük olmalı; eşit olunca şekil düzleşir.`
      : `${shortSides[0].key} + ${shortSides[1].key} = ${shortSum}. En uzun ${longestSide.key} = ${longestSide.value}. Kapanması için en az ${closingNeed} birim daha gerekiyor.`;
  const inequalityChecks = [
    { label: 'A + B > C', sum: a + b, side: c, ok: a + b > c },
    { label: 'A + C > B', sum: a + c, side: b, ok: a + c > b },
    { label: 'B + C > A', sum: b + c, side: a, ok: b + c > a },
  ];

  const setSideValue = (side: SideKey, value: number) => {
    const nextValue = clampSide(value);
    if (side === 'A') setA(nextValue);
    if (side === 'B') setB(nextValue);
    if (side === 'C') setC(nextValue);
  };

  // State calculations
  useEffect(() => {
    if (phase === 0 && isValid) {
        showMessage("Harika! İki kısa çubuğun toplamı en uzun çubuktan büyük oldu. Uçlar birleşti ve üçgen kapandı!", "success");
        setPhase(1);
        setTypesFound(prev => ({ ...prev, [currentType]: true }));
    } else if (phase === 1 && isValid) {
        setTypesFound(prev => {
            if (prev[currentType]) return prev;
            return { ...prev, [currentType]: true };
        });
    }
  }, [
    isValid,
    currentType,
    phase,
    showMessage,
  ]);

  useEffect(() => {
    if (phase === 0) {
        showMessage("Çubuk uzunluklarını + ve - ile değiştir. İki kısa çubuğun toplamı en uzun çubuktan büyük olursa üçgen kapanır.", "info");
    }
  }, [phase, showMessage]);

  useEffect(() => {
      if (phase === 1) {
          if (typesFound.EQUILATERAL && typesFound.ISOSCELES && typesFound.SCALENE) {
              setPhase(2);
          } else {
              const missing: string[] = [];
              if (!typesFound.EQUILATERAL) missing.push("Eşkenar");
              if (!typesFound.ISOSCELES) missing.push("İkizkenar");
              if (!typesFound.SCALENE) missing.push("Çeşitkenar");

              const foundCount = 3 - missing.length;
              if (foundCount === 2) {
                  showMessage(`Mükemmel gidiyorsun! Son bir tane kaldı: Kilit açmak için bir ${missing[0]} Üçgen oluştur!`, "info");
              } else if (foundCount === 1) {
                  const timer = setTimeout(() => {
                     showMessage(`Diğer varyasyonları da keşfetmeliyiz! Eksik olanlar: ${missing.join(', ')}`, "info");
                  }, 8000);
                  return () => clearTimeout(timer);
              }
          }
      }
  }, [typesFound, phase, showMessage]);

  useEffect(() => {
      if (phase === 2) {
          showMessage("SİSTEM TAMAMLANDI! Poligon Kalkanı aktif.", "success");
          const timer = setTimeout(() => {
              unlockAtom('MAT.5.3.7.1');
              unlockModule('polygon-collision-test');
              addScore(1500);
              setShowVictory(true);
          }, 4000);
          return () => clearTimeout(timer);
      }
  }, [phase, unlockAtom, unlockModule, addScore, showMessage]);

  // Geometry Calculations
  const scale = 18; // Rescaled to prevent SVG viewport overflow with max values (15)
  const cScaled = c * scale;
  const bScaled = b * scale;
  const aScaled = a * scale;

  let angleB = 0;
  let angleA = 180;

  if (isValid) {
    const cosB = (b * b + c * c - a * a) / (2 * b * c);
    const radB = Math.acos(cosB);
    angleB = -radB * (180 / Math.PI);

    const tipX = bScaled * Math.cos(radB);
    const tipY = -bScaled * Math.sin(radB);

    const radA = Math.atan2(tipY, tipX - cScaled);
    angleA = radA * (180 / Math.PI);
  } else {
    // Drop them to the floor visually
    if (a + b <= c) {
      angleB = 0;
      angleA = 180;
    } else if (b + c <= a) {
      angleB = 180;
      angleA = 180;
    } else if (a + c <= b) {
      angleB = 0;
      angleA = 0;
    }
  }

  // Calculate triangle vertices for polygon fill if valid
  const p1 = { x: -cScaled/2, y: 0 };
  const p2 = { x: cScaled/2, y: 0 };

  // Calculate tips using exact angles
  const bTipX = p1.x + bScaled * Math.cos(angleB * Math.PI / 180);
  const bTipY = p1.y + bScaled * Math.sin(angleB * Math.PI / 180);
  const aTipX = p2.x + aScaled * Math.cos(angleA * Math.PI / 180);
  const aTipY = p2.y + aScaled * Math.sin(angleA * Math.PI / 180);

  // tip wrt origin at center of C
  const p3 = isValid ? { x: bTipX, y: bTipY } : null;

  return (
    <div className="h-full w-full bg-[#05050A] text-white overflow-y-auto overflow-x-hidden relative selection:bg-[#B388FF]/30 flex flex-col pb-16">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]"></div>
      </div>

      <GameHeader
        title="ÜÇGEN ÇUBUK ATÖLYESİ"
        subtitle="ÜÇGEN EŞİTSİZLİĞİ"
        rightContent={
          isValid && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-xs px-4 py-2 font-mono tracking-widest text-[#00FF88] bg-[#00FF88]/10 rounded-lg border border-[#00FF88]/30 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                  BAĞLANTI BAŞARILI
              </motion.div>
          )
        }
      />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">

          {/* Sol Panel: Kontrol Paneli */}
          <div className="lg:col-span-1 flex flex-col gap-3 overflow-y-auto CustomScrollbar pr-2">

            {/* Uzunluk Kontrolleri */}
            <div className="bg-[#12121A]/80 backdrop-blur-xl border border-gray-800 p-4 rounded-3xl shadow-2xl relative overflow-hidden flex-shrink-0 flex flex-col gap-4">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10 rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 p-3">
                    <div className="flex items-start gap-2">
                        <Target className="mt-0.5 h-4 w-4 text-[#8DF4FF]" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8DF4FF]">Hedef</p>
                            <p className="mt-1 text-sm font-bold leading-snug text-white">
                                İki kısa çubuğun toplamı en uzun çubuktan büyük olsun.
                            </p>
                        </div>
                    </div>
                </div>

                {sideControls.map((side) => (
                    <LengthControl
                        key={side.key}
                        label={`${side.name} (${side.key})`}
                        value={side.value}
                        color={side.color}
                        onDecrease={() => setSideValue(side.key, side.value - 1)}
                        onIncrease={() => setSideValue(side.key, side.value + 1)}
                        onChange={(nextValue) => setSideValue(side.key, nextValue)}
                    />
                ))}
            </div>

            {/* Görev Durumu */}
            <div className="bg-black/40 border border-[#B388FF]/20 rounded-2xl p-3 flex-shrink-0">
                <h4 className="text-[10px] text-[#B388FF] uppercase tracking-widest font-bold mb-2 border-b border-[#B388FF]/20 pb-1.5">Keşif Görevleri</h4>
                <p className="mb-3 text-xs leading-relaxed text-white/60">
                    Önce üçgeni kapat. Sonra farklı uzunluklarla üç üçgen türünü yakala.
                </p>
                <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-mono">
                    <div className={`flex justify-between ${typesFound.EQUILATERAL ? 'text-[#00FF88]' : ''}`}>
                        <span>Eşkenar</span> <span>{typesFound.EQUILATERAL ? '✓' : '—'}</span>
                    </div>
                    <div className={`flex justify-between ${typesFound.ISOSCELES ? 'text-[#00FF88]' : ''}`}>
                        <span>İkizkenar</span> <span>{typesFound.ISOSCELES ? '✓' : '—'}</span>
                    </div>
                    <div className={`flex justify-between ${typesFound.SCALENE ? 'text-[#00FF88]' : ''}`}>
                        <span>Çeşitkenar</span> <span>{typesFound.SCALENE ? '✓' : '—'}</span>
                    </div>
                </div>
            </div>

            {/* Matematik Paneli */}
            <div className="bg-black/40 border border-[#00E5FF]/20 rounded-2xl p-3 flex-shrink-0">
                <h4 className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold mb-2 border-b border-[#00E5FF]/20 pb-1.5">Kapanma Kuralı</h4>
                <div className={`rounded-2xl border p-3 ${isValid ? 'border-[#00FF88]/30 bg-[#00FF88]/10' : 'border-[#FF3366]/30 bg-[#FF3366]/10'}`}>
                    <div className="flex items-start gap-2">
                        {isValid ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#00FF88]" />
                        ) : (
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-[#FF6688]" />
                        )}
                        <div>
                            <p className={`text-sm font-black ${isValid ? 'text-[#B8FFD8]' : 'text-[#FFB8C8]'}`}>
                                {statusHeadline}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-white/70">{statusCopy}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 space-y-2">
                    {inequalityChecks.map((check) => (
                        <div
                            key={check.label}
                            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs font-bold ${
                                check.ok
                                    ? 'border-[#00FF88]/20 bg-[#00FF88]/8 text-[#B8FFD8]'
                                    : 'border-[#FF3366]/24 bg-[#FF3366]/8 text-[#FFB8C8]'
                            }`}
                        >
                            <span>{check.label}</span>
                            <span className="font-mono">
                                {check.sum} &gt; {check.side} {check.ok ? '✓' : '×'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Sağ Panel: Fizik Kanvası */}
          <div className="lg:col-span-3 bg-[#0A0A0F]/90 backdrop-blur border border-gray-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] min-h-[500px]">
             <motion.div
               key={statusHeadline}
               initial={{ opacity: 0, y: -16, scale: 0.96 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className={`absolute top-6 left-1/2 z-20 w-[min(86%,620px)] -translate-x-1/2 rounded-2xl border px-5 py-3 text-center shadow-[0_18px_46px_rgba(0,0,0,0.35)] backdrop-blur-md ${
                 isValid
                   ? 'border-[#00FF88]/35 bg-[#05301F]/78 text-[#D8FFE8]'
                   : 'border-[#FF3366]/35 bg-[#35101C]/82 text-[#FFD1DC]'
               }`}
             >
               <div className="flex items-center justify-center gap-2">
                 {isValid ? <Triangle className="h-4 w-4 text-[#00FF88]" /> : <AlertTriangle className="h-4 w-4 text-[#FF6688]" />}
                 <p className="text-[11px] font-black uppercase tracking-[0.22em]">{statusHeadline}</p>
               </div>
               <p className="mt-1 text-sm font-bold leading-snug text-white/82">{statusCopy}</p>
             </motion.div>

             <svg width="100%" height="100%" viewBox="-400 -300 800 600" className="overflow-visible absolute inset-0">
                {/* Dağılan Yaylar (Radii Arcs) */}
                <circle
                    cx={p1.x} cy={p1.y}
                    r={bScaled}
                    fill="none"
                    stroke="#33CCFF"
                    strokeWidth="1.5"
                    strokeDasharray="6,8"
                    className="opacity-20"
                />
                <circle
                    cx={p2.x} cy={p2.y}
                    r={aScaled}
                    fill="none"
                    stroke="#FF3366"
                    strokeWidth="1.5"
                    strokeDasharray="6,8"
                    className="opacity-20"
                />

                {/* Geometri İç Dolgu (Sadece üçgen oluştuğunda) */}
                <AnimatePresence>
                    {isValid && p3 && (
                        <motion.path
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 0.15,
                                d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`
                            }}
                            exit={{ opacity: 0 }}
                            fill="#00E5FF"
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    )}
                </AnimatePresence>

                {/* Baz Çizgisi (Yeşil C) */}
                <line
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="#00FF88" strokeWidth="8" strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                />

                {/* Sol Pivot */}
                <circle cx={p1.x} cy={p1.y} r="6" fill="#12121A" stroke="#00FF88" strokeWidth="3" className="z-10 relative" />
                {/* Sağ Pivot */}
                <circle cx={p2.x} cy={p2.y} r="6" fill="#12121A" stroke="#00FF88" strokeWidth="3" className="z-10 relative" />

                {/* Mavi (B) Çizgisi - Sol uca bağlı */}
                <line
                    x1={p1.x} y1={p1.y} x2={bTipX} y2={bTipY}
                    stroke="#33CCFF" strokeWidth="8" strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(51,204,255,0.8)]"
                />
                <circle
                    cx={bTipX} cy={bTipY} r="6" fill="#12121A" stroke="#33CCFF" strokeWidth="3"
                    className="z-10 relative"
                />

                {/* Kırmızı (A) Çizgisi - Sağ uca bağlı */}
                <line
                    x1={p2.x} y1={p2.y} x2={aTipX} y2={aTipY}
                    stroke="#FF3366" strokeWidth="8" strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]"
                />
                <circle
                    cx={aTipX} cy={aTipY} r="6" fill="#12121A" stroke="#FF3366" strokeWidth="3"
                    className="z-10 relative"
                />

                {/* Çatışma Yoksa Açıklık Mesafesini Göster (Kırmızı Kesik Çizgi) */}
                <AnimatePresence>
                    {!isValid && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Mühendislik tarzı ölçüm çizgileri */}
                            <line
                                x1={bTipX} y1={bTipY + 40}
                                x2={aTipX} y2={aTipY + 40}
                                stroke="#FF3366" strokeWidth="2" strokeDasharray="6,6"
                            />
                            <line
                                x1={bTipX} y1={bTipY} x2={bTipX} y2={bTipY + 40}
                                stroke="#FF3366" strokeWidth="1" strokeDasharray="2,4" opacity="0.6"
                            />
                            <line
                                x1={aTipX} y1={aTipY} x2={aTipX} y2={aTipY + 40}
                                stroke="#FF3366" strokeWidth="1" strokeDasharray="2,4" opacity="0.6"
                            />

                            {/* Mesafeyi Metin Olarak Ekle */}
                            <text
                                x={(bTipX + aTipX) / 2}
                                y={(bTipY + aTipY) / 2 + 60}
                                fill="#FF3366"
                                textAnchor="middle"
                                className="font-mono text-sm tracking-widest fill-[#FF3366] drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]"
                            >
                                {(Math.hypot(bTipX - aTipX, bTipY - aTipY) / scale).toFixed(1)} U AÇIKLIK
                            </text>
                        </motion.g>
                    )}
                </AnimatePresence>
             </svg>

             {/* Alt Bilgi Paneli */}
             <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-2xl border border-gray-800 bg-black/68 px-5 py-3 text-sm font-black shadow-lg backdrop-blur pointer-events-none">
                 <span className="font-mono text-[#FF3366] drop-shadow-[0_0_5px_rgba(255,51,102,0.5)]">A={a}</span>
                 <span className="font-mono text-[#33CCFF] drop-shadow-[0_0_5px_rgba(51,204,255,0.5)]">B={b}</span>
                 <span className="font-mono text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">C={c}</span>
                 <span className="h-5 w-px bg-white/15" />
                 <span className="text-white/72">Kısa toplam: {shortSum}</span>
                 <span className="text-white/72">En uzun: {longestSide.value}</span>
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showVictory && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#12121A] border border-[#00FF88]/30 p-8 md:p-12 rounded-3xl max-w-2xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)] flex flex-col items-center text-center">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
                 <div className="w-24 h-24 bg-[#00FF88]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                     <CheckCircle2 className="w-12 h-12 text-[#00FF88]" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Kalkan Aktif</h2>
                 <p className="text-gray-400 mb-8 max-w-lg text-lg leading-relaxed">
                   Tebrikler! Üçgen eşitsizliğini kırarak her kenarın fiziksel olarak nasıl sınırlandığını çözdünüz.
                 </p>
                 <div className="flex gap-4">
                     <Link to="/" className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all hover:scale-105 uppercase tracking-widest text-sm">
                         Ana Merkeze Dön
                     </Link>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
