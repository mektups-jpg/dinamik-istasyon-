import { useMemo, useState } from 'react';
import { Check, ChevronsLeftRight, MoveVertical, Orbit, RotateCcw, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'function-hologram-room';

const MISSIONS: MissionStep[] = [
  { id: 'reference-line', title: 'Referans Lazer', atomId: 'MAT.9.2.1.1', prompt: 'Hologramı f(x)=x çizgisine sıfırla. Eğim 1, yatay ve dikey kaydırma 0 olmalı.' },
  { id: 'vertical-shift', title: 'Dikey İtki', atomId: 'MAT.9.2.1.2', prompt: 'Çizgiyi Y ekseninde +2 yukarı taşı. k değeri grafiği fiziksel olarak iter.' },
  { id: 'slope-horizontal', title: 'Eğim ve Yatay Kaydırma', atomId: 'MAT.9.2.1.4', prompt: 'k=2 kalsın; eğimi a=2 yap ve r=-1 ile çizgiyi sola kaydır.' },
  { id: 'absolute-mirror', title: 'Mutlak Değer Aynası', atomId: 'MAT.9.2.2.1', prompt: 'Aynayı aç. Negatif ışınlar yukarı kırılıp V hologramına dönüşmeli.' },
  { id: 'inequality-field', title: 'Eşitsizlik Alanı', atomId: 'MAT.9.2.3.2', prompt: 'Eşitsizlik tarayıcısını aç ve y >= f(x) alanını üst tarafta parlat.' },
];

const ATOM_IDS = [
  'MAT.9.2.1.1',
  'MAT.9.2.1.2',
  'MAT.9.2.1.3',
  'MAT.9.2.1.4',
  'MAT.9.2.2.1',
  'MAT.9.2.2.2',
  'MAT.9.2.3.2',
];

type GraphMode = 'linear' | 'absolute' | 'inequality';
type InequalitySide = 'above' | 'below';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const functionValue = (x: number, mode: GraphMode, a: number, r: number, k: number): number => {
  const base = a * (x - r);
  return mode === 'absolute' ? Math.abs(base) + k : base + k;
};

export default function FunctionHologramRoomApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [a, setA] = useState(1);
  const [r, setR] = useState(0);
  const [k, setK] = useState(0);
  const [mode, setMode] = useState<GraphMode>('linear');
  const [side, setSide] = useState<InequalitySide>('above');
  const activeIndex = progress.activeIndex;

  const resetControls = () => {
    setA(1);
    setR(0);
    setK(0);
    setMode('linear');
    setSide('above');
  };

  const restart = () => {
    resetControls();
    progress.restart();
  };

  const checks = [
    mode === 'linear' && a === 1 && r === 0 && k === 0,
    mode === 'linear' && a === 1 && r === 0 && k === 2,
    mode === 'linear' && a === 2 && r === -1 && k === 2,
    mode === 'absolute',
    mode === 'inequality' && side === 'above',
  ];

  const handleCheck = () => {
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Hologram hedef dönüşümü gösterdi. Bir sonraki grafik katmanı açılıyor.',
      error: 'Grafik hedefle çakışmadı. Aktif kolu veya modu yeniden ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Fonksiyonel Hologram Odası"
      subtitle="MAT.9.2.1.x / MAT.9.2.2.x / MAT.9.2.3.2"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#030711] [background-image:radial-gradient(circle_at_18%_20%,rgba(0,229,255,0.20),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(255,0,85,0.13),transparent_26%),linear-gradient(180deg,#030711_0%,#071426_58%,#040712_100%)]"
      badges={[
        { label: 'Mod', value: mode === 'absolute' ? '|f(x)|' : mode === 'inequality' ? 'Alan' : 'Lazer', tone: 'purple' },
        { label: 'a r k', value: `${a} ${r} ${k}`, tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <HologramScene activeIndex={activeIndex} a={a} r={r} k={k} mode={mode} side={side} />
        <HologramControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          a={a}
          r={r}
          k={k}
          mode={mode}
          side={side}
          setA={setA}
          setR={setR}
          setK={setK}
          setMode={setMode}
          setSide={setSide}
          resetReference={resetControls}
          onCheck={handleCheck}
          onReset={resetControls}
        />
      </div>
    </Grade9LabShell>
  );
}

interface HologramSceneProps {
  activeIndex: number;
  a: number;
  r: number;
  k: number;
  mode: GraphMode;
  side: InequalitySide;
}

function HologramScene({ activeIndex, a, r, k, mode, side }: HologramSceneProps) {
  const lineMode = mode === 'inequality' ? 'linear' : mode;
  const graphPath = useMemo(() => {
    const points: string[] = [];
    for (let x = -6; x <= 6.01; x += 0.25) {
      const y = functionValue(x, lineMode, a, r, k);
      points.push(`${180 + x * 26},${180 - y * 26}`);
    }
    return points.join(' ');
  }, [a, k, lineMode, r]);

  const inequalityField = useMemo(() => {
    const boundary: string[] = [];
    for (let x = -6; x <= 6.01; x += 0.35) {
      const y = functionValue(x, 'linear', a, r, k);
      boundary.push(`${180 + x * 26},${180 - y * 26}`);
    }
    return side === 'above' ? `24,24 ${boundary.join(' ')} 336,24` : `24,336 ${boundary.join(' ')} 336,336`;
  }, [a, k, r, side]);

  return (
    <section data-testid="function-scene" className="relative overflow-hidden rounded-[32px] border border-cyan-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(0,229,255,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,229,255,0.14),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">tek ana deney</p>
          <h2 className="text-2xl font-black text-white">Grafiği Tut, Kaydır, Katla</h2>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 font-mono text-sm font-black text-cyan-100">
          f(x)={mode === 'absolute' ? `|${a}(x-${r})|+${k}` : `${a}(x-${r})+${k}`}
        </div>
      </div>

      <svg viewBox="0 0 360 360" className="relative h-[560px] w-full rounded-[28px] border border-white/10 bg-[#020611]/78">
        <defs>
          <pattern id="function-grid-v3" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M 26 0 L 0 0 0 26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
          <linearGradient id="function-line-v3" x1="0" x2="1">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="52%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#B388FF" />
          </linearGradient>
        </defs>
        <rect width="360" height="360" fill="url(#function-grid-v3)" />
        <line x1="0" y1="180" x2="360" y2="180" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
        <line x1="180" y1="0" x2="180" y2="360" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
        <path d="M24 336 L336 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="7 8" />
        <text x="294" y="50" fill="rgba(255,255,255,0.48)" fontSize="11" fontWeight="900">f(x)=x</text>

        {activeIndex === 4 || mode === 'inequality' ? (
          <>
            <motion.polygon points={inequalityField} fill="rgba(0,229,255,0.17)" stroke="rgba(0,229,255,0.24)" animate={{ opacity: [0.45, 0.86, 0.45] }} transition={{ duration: 1.6, repeat: Infinity }} />
            {[72, 110, 148, 186, 224].map((y, index) => (
              <motion.line key={y} x1="34" x2="326" y1={y} y2={y} stroke="rgba(0,229,255,0.34)" strokeWidth="2" strokeDasharray="10 14" animate={{ x1: [34, 62, 34], x2: [326, 298, 326] }} transition={{ delay: index * 0.08, duration: 1.6, repeat: Infinity }} />
            ))}
          </>
        ) : null}

        {mode === 'absolute' ? (
          <>
            <line x1="28" y1={180 - k * 26} x2="332" y2={180 - k * 26} stroke="rgba(255,0,85,0.30)" strokeWidth="3" strokeDasharray="6 9" />
            <motion.path d={`M 28 ${180 - k * 26} C ${92 + r * 12} ${266 - k * 20}, ${132 + r * 18} ${222 - k * 16}, ${180 + r * 26} ${180 - k * 26}`} fill="none" stroke="rgba(255,0,85,0.44)" strokeWidth="9" strokeLinecap="round" animate={{ opacity: [0.25, 0.66, 0.25] }} transition={{ duration: 1.2, repeat: Infinity }} />
          </>
        ) : null}

        <motion.polyline points={graphPath} fill="none" stroke="url(#function-line-v3)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 10px rgba(0,229,255,0.8))" animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <circle cx={180 + r * 26} cy={180 - k * 26} r="7" fill="#00FF88" stroke="#FFFFFF" strokeWidth="2" />
        <text x="180" y="340" textAnchor="middle" fill="#00E5FF" fontSize="14" fontWeight="900">
          {activeIndex === 3 ? 'Mutlak değer aynası negatif ışını yukarı kırar' : activeIndex === 4 ? 'Üst alan y >= f(x) çözüm bölgesidir' : 'a eğimi döndürür, r/k grafiği kaydırır'}
        </text>
      </svg>
    </section>
  );
}

interface HologramControlsProps {
  mission: MissionStep;
  activeIndex: number;
  a: number;
  r: number;
  k: number;
  mode: GraphMode;
  side: InequalitySide;
  setA: (value: number) => void;
  setR: (value: number) => void;
  setK: (value: number) => void;
  setMode: (value: GraphMode) => void;
  setSide: (value: InequalitySide) => void;
  resetReference: () => void;
  onCheck: () => void;
  onReset: () => void;
}

function HologramControls(props: HologramControlsProps) {
  const { mission, activeIndex, a, r, k, mode, side, setA, setR, setK, setMode, setSide, resetReference, onCheck, onReset } = props;
  return (
    <aside className="rounded-[30px] border border-cyan-300/18 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">hologram görevi {activeIndex + 1}/5</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        {activeIndex === 0 ? (
          <button data-testid="function-reference-lock" onClick={resetReference} className="min-h-[70px] w-full rounded-2xl border border-cyan-300/22 bg-cyan-300/10 px-4 text-left font-black text-cyan-100 hover:border-cyan-300/45">Referans lazeri f(x)=x konumuna sıfırla</button>
        ) : null}
        {activeIndex === 1 ? <ExperimentSlider testId="function-k-slider" label="k dikey itki" min={-3} max={4} value={k} onChange={setK} completeValue={2} icon="vertical" /> : null}
        {activeIndex === 2 ? (
          <div className="space-y-4">
            <ExperimentSlider testId="function-a-slider" label="a eğim kolu" min={-3} max={3} value={a} onChange={setA} completeValue={2} icon="orbit" />
            <ExperimentSlider testId="function-r-slider" label="r yatay sürgü" min={-3} max={3} value={r} onChange={setR} completeValue={-1} icon="horizontal" />
          </div>
        ) : null}
        {activeIndex === 3 ? (
          <button data-testid="function-mode-absolute" onClick={() => setMode('absolute')} className={`min-h-[70px] w-full rounded-2xl border px-4 text-left font-black transition ${mode === 'absolute' ? 'border-[#FF0055]/45 bg-[#FF0055]/12 text-[#FF6B9A]' : 'border-white/10 bg-white/5 text-white/75 hover:border-[#FF0055]/35'}`}>Mutlak değer aynasını aç</button>
        ) : null}
        {activeIndex === 4 ? (
          <div className="space-y-3">
            <button data-testid="function-mode-inequality" onClick={() => setMode('inequality')} className={`min-h-[60px] w-full rounded-2xl border px-4 text-left font-black ${mode === 'inequality' ? 'border-cyan-300/45 bg-cyan-300/12 text-cyan-100' : 'border-white/10 bg-white/5 text-white/75'}`}>Eşitsizlik tarayıcısını aç</button>
            <button data-testid="function-side-above" onClick={() => setSide('above')} className={`min-h-[54px] w-full rounded-2xl border px-4 text-left font-black ${side === 'above' ? 'border-[#00FF88]/45 bg-[#00FF88]/12 text-[#00FF88]' : 'border-white/10 bg-white/5 text-white/75'}`}>Üst bölge: y &gt;= f(x)</button>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="function-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Hologramı Onayla
        </SciFiButton>
        <SciFiButton data-testid="function-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-2xl border border-pink-300/15 bg-pink-300/[0.06] p-4 text-xs leading-relaxed text-pink-50/70">
        <ScanLine className="mb-2 h-4 w-4 text-pink-200" />
        Formülü ezberlemek yerine, parametrelerin grafiği nasıl ittiğini sahnede gör.
      </div>
    </aside>
  );
}

function ExperimentSlider({ testId, label, value, onChange, min, max, completeValue, icon }: { testId: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; completeValue: number; icon: 'vertical' | 'horizontal' | 'orbit' }) {
  const Icon = icon === 'vertical' ? MoveVertical : icon === 'horizontal' ? ChevronsLeftRight : Orbit;
  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <Icon className="h-4 w-4 text-[#00E5FF]" /> {label}: {value}
      </span>
      <input data-testid={testId} type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} className="h-12 w-full accent-[#00E5FF]" />
      <button type="button" data-testid={`${testId}-complete`} onClick={() => onChange(completeValue)} className="mt-3 min-h-[44px] w-full rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-black uppercase tracking-wider text-cyan-100 hover:border-cyan-300/45">
        Hedefe Sürükle
      </button>
    </label>
  );
}
