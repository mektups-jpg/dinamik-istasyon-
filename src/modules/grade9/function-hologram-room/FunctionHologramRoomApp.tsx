import React, { useMemo, useState } from 'react';
import { Activity, ArrowDownUp, Check, ChevronsLeftRight, Gauge, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'function-hologram-room';

const MISSIONS: MissionStep[] = [
  {
    id: 'reference-line',
    title: 'Referans Lazer',
    atomId: 'MAT.9.2.1.1',
    prompt: 'Hologram odasını f(x)=x referans çizgisine sıfırla. Eğim 1, yatay ve dikey kaydırma 0 olmalı.',
  },
  {
    id: 'vertical-shift',
    title: 'Dikey İtki',
    atomId: 'MAT.9.2.1.2',
    prompt: 'Lazer çizgisini Y ekseninde +2 taşı. k değeri çizgiyi yukarı iter.',
  },
  {
    id: 'slope-horizontal',
    title: 'Eğim ve Yatay Kaydırma',
    atomId: 'MAT.9.2.1.4',
    prompt: 'k=2 yüksekliğini koru, eğimi a=2 yap ve çizgiyi r=-1 ile sola taşı. Böylece lazer hem dikleşir hem yatay ötelenir.',
  },
  {
    id: 'absolute-mirror',
    title: 'Mutlak Değer Aynası',
    atomId: 'MAT.9.2.2.1',
    prompt: 'Mutlak değer aynasını aç. Negatif bölgede kalan ışınlar pozitife kırılıp V hologramı oluşturmalı.',
  },
  {
    id: 'inequality-field',
    title: 'Eşitsizlik Alanı',
    atomId: 'MAT.9.2.3.2',
    prompt: 'Eşitsizlik modunda y >= f(x) bölgesini tarat. Çözüm alanı doğrunun üst tarafında parlamalı.',
  },
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

  const graphPath = useMemo(() => {
    const points: string[] = [];
    for (let x = -6; x <= 6.01; x += 0.25) {
      const y = functionValue(x, mode, a, r, k);
      points.push(`${180 + x * 26},${180 - y * 26}`);
    }
    return points.join(' ');
  }, [a, k, mode, r]);

  const inequalityField = useMemo(() => {
    const boundary: string[] = [];
    for (let x = -6; x <= 6.01; x += 0.35) {
      const y = functionValue(x, 'linear', a, r, k);
      boundary.push(`${180 + x * 26},${180 - y * 26}`);
    }
    return side === 'above'
      ? `24,24 ${boundary.join(' ')} 336,24`
      : `24,336 ${boundary.join(' ')} 336,336`;
  }, [a, k, r, side]);

  const handleCheck = () => {
    const checks = [
      mode === 'linear' && a === 1 && r === 0 && k === 0,
      mode === 'linear' && a === 1 && r === 0 && k === 2,
      mode === 'linear' && a === 2 && r === -1 && k === 2,
      mode === 'absolute',
      mode === 'inequality' && side === 'above',
    ];
    const ok = checks[progress.activeIndex] ?? false;

    progress.submitMission({
      ok,
      success: 'Hologram verisi doğru eşleşti. Bir sonraki dönüşüm paneli açıldı.',
      error: 'Grafik hedefle eşleşmiyor. Panel değerlerini ve aktif modu tekrar kontrol et.',
    });
  };

  const setDelta = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
    setter((current) => clamp(current + delta, -4, 4));
  };

  return (
    <Grade9LabShell
      title="Fonksiyonel Hologram Odası"
      subtitle="MAT.9.2.1.x / MAT.9.2.2.x / MAT.9.2.3.2"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      frameClassName="bg-[#030711] [background-image:radial-gradient(circle_at_18%_20%,rgba(0,229,255,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(255,0,85,0.14),transparent_25%),linear-gradient(180deg,#030711_0%,#071426_58%,#040712_100%)]"
      badges={[
        { label: 'Model', value: mode === 'absolute' ? '|f(x)|' : mode === 'inequality' ? 'Alan' : 'f(x)', tone: 'purple' },
        { label: 'Denklem', value: `a=${a} r=${r} k=${k}`, tone: 'cyan' },
      ]}
    >
      <div className="space-y-4">
        <HologramBrief activeMission={progress.activeMission} activeIndex={progress.activeIndex} total={MISSIONS.length} mode={mode} />
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 rounded-[28px] border border-cyan-300/15 bg-cyan-950/20 p-4 shadow-[inset_0_0_35px_rgba(0,229,255,0.05)]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <MetricPill label="a eğim" value={String(a)} tone="cyan" />
            <MetricPill label="r yatay" value={String(r)} tone="purple" />
            <MetricPill label="k dikey" value={String(k)} tone="green" />
            <MetricPill label="bölge" value={side === 'above' ? 'y >= f(x)' : 'y <= f(x)'} tone="amber" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/40">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12),transparent_62%)]" />
            <svg viewBox="0 0 360 360" className="relative h-full w-full">
              <defs>
                <pattern id="function-grid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M 26 0 L 0 0 0 26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </pattern>
                <linearGradient id="function-line" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00FF88" />
                  <stop offset="52%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#B388FF" />
                </linearGradient>
              </defs>
              <rect width="360" height="360" fill="url(#function-grid)" />
              <line x1="0" y1="180" x2="360" y2="180" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
              <line x1="180" y1="0" x2="180" y2="360" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
              {mode === 'inequality' ? (
                <motion.polygon
                  points={inequalityField}
                  fill="rgba(0,229,255,0.16)"
                  stroke="rgba(0,229,255,0.25)"
                  initial={false}
                  animate={{ opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              ) : null}
              {mode === 'absolute' ? (
                <path d="M 24 180 Q 180 180 336 24" fill="none" stroke="rgba(255,0,85,0.18)" strokeWidth="10" strokeLinecap="round" />
              ) : null}
              <motion.polyline
                points={graphPath}
                fill="none"
                stroke="url(#function-line)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 10px rgba(0,229,255,0.8))"
                initial={false}
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <circle cx={180 + r * 26} cy={180 - k * 26} r="6" fill="#00FF88" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <ChoiceButton testId="function-mode-linear" selected={mode === 'linear'} label="Doğrusal Lazer" detail="f(x)=a(x-r)+k" onClick={() => setMode('linear')} />
            <ChoiceButton testId="function-mode-absolute" selected={mode === 'absolute'} label="Mutlak Değer Aynası" detail="Negatif ışın pozitife katlanır" onClick={() => setMode('absolute')} tone="pink" />
            <ChoiceButton testId="function-mode-inequality" selected={mode === 'inequality'} label="Eşitsizlik Alanı" detail="Çözüm bölgesini boyar" onClick={() => setMode('inequality')} tone="amber" />
          </div>

          <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <Gauge className="h-4 w-4 text-[#00E5FF]" /> Dönüşüm Konsolu
            </h4>
            <Stepper testId="function-a" label="a eğimi" value={a} icon={<Activity className="h-4 w-4" />} onMinus={() => setDelta(setA, -1)} onPlus={() => setDelta(setA, 1)} />
            <Stepper testId="function-r" label="r yatay" value={r} icon={<ChevronsLeftRight className="h-4 w-4" />} onMinus={() => setDelta(setR, -1)} onPlus={() => setDelta(setR, 1)} />
            <Stepper testId="function-k" label="k dikey" value={k} icon={<ArrowDownUp className="h-4 w-4" />} onMinus={() => setDelta(setK, -1)} onPlus={() => setDelta(setK, 1)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton testId="function-side-above" selected={side === 'above'} label="Üst Alan" detail="y >= f(x)" onClick={() => setSide('above')} tone="green" />
            <ChoiceButton testId="function-side-below" selected={side === 'below'} label="Alt Alan" detail="y <= f(x)" onClick={() => setSide('below')} tone="pink" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="function-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              Hedefi Doğrula
            </SciFiButton>
            <SciFiButton data-testid="function-reset" variant="secondary" onClick={resetControls} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
      </div>
    </Grade9LabShell>
  );
}

function HologramBrief({ activeMission, activeIndex, total, mode }: { activeMission: MissionStep; activeIndex: number; total: number; mode: GraphMode }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-cyan-300/[0.055] p-5 shadow-[0_0_45px_rgba(0,229,255,0.10)]">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(0,229,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-cyan-200/70">Hologram direktifi {activeIndex + 1}/{total}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">{activeMission.prompt}</p>
        </div>
        <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-cyan-300/20 bg-black/30 p-3 lg:w-[260px] lg:shrink-0">
          <div className="h-14 w-14 rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_22px_rgba(0,229,255,0.22)]" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/55">ışık modu</p>
            <p className="text-lg font-black leading-tight text-cyan-100">{mode === 'absolute' ? 'ayna kırılması' : mode === 'inequality' ? 'alan taraması' : 'doğrusal lazer'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepperProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  onMinus: () => void;
  onPlus: () => void;
  testId: string;
}

function Stepper({ label, value, icon, onMinus, onPlus, testId }: StepperProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 p-2 last:mb-0">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
        <span className="text-[#00E5FF]">{icon}</span>
        {label}
      </div>
      <div className="flex items-center gap-2">
        <motion.button data-testid={`${testId}-minus`} whileTap={{ scale: 0.92 }} onClick={onMinus} className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-lg font-black hover:border-[#00E5FF]/40">
          -
        </motion.button>
        <span className="w-8 text-center font-mono text-lg font-black text-white">{value}</span>
        <motion.button data-testid={`${testId}-plus`} whileTap={{ scale: 0.92 }} onClick={onPlus} className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-lg font-black hover:border-[#00E5FF]/40">
          +
        </motion.button>
      </div>
    </div>
  );
}
