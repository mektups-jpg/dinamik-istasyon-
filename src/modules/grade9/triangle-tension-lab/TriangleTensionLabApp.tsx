import { useMemo, useState } from 'react';
import { Check, MoveHorizontal, RotateCcw, Ruler, Triangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'triangle-tension-lab';

const ATOM_IDS = [
  'MAT.9.4.1.1',
  'MAT.9.4.1.2',
  'MAT.9.5.2.1',
  'MAT.9.5.2.2',
  'MAT.9.5.3.1',
  'MAT.9.5.3.2',
  'MAT.9.5.3.3',
];

const MISSIONS: MissionStep[] = [
  { id: 'angle-side', title: 'Açı-Kenar Gerilimi', atomId: 'MAT.9.4.1.1', prompt: 'A köşesini çekerek açıyı büyüt. Karşı ip BC fiziksel olarak en uzun kenara dönüşmeli.' },
  { id: 'angle-sum', title: 'İç Açı Toplamı', atomId: 'MAT.9.4.1.2', prompt: '42° ve 73° sabitken üçüncü açıyı 65° konumuna getir. Üç ışın 180° çizgisini tamamlamalı.' },
  { id: 'similarity-angle', title: 'Benzerlik Üst Üste Bindirme', atomId: 'MAT.9.5.2.1', prompt: 'Hayalet üçgeni ana üçgene bindir. Eş açılar çakışınca benzerlik kilidi parlar.' },
  { id: 'similarity-side', title: 'Oranlı Kenar Büyütme', atomId: 'MAT.9.5.2.2', prompt: 'Küçük 3-4-5 üçgenini 2 kat büyüt. 6-8-10 izinin üstüne tam oturmalı.' },
  { id: 'theorem-lock', title: 'Teorem Bağlantı Işını', atomId: 'MAT.9.5.3.2', prompt: 'Dik üçgendeki yükseklik ışınını hipotenüse indir. h² = p·k bağlantısı parlamalı.' },
];

interface TriangleState {
  angleA: number;
  missingAngle: number;
  similarityLock: number;
  scale: number;
  theoremCharge: number;
}

const initialState: TriangleState = {
  angleA: 58,
  missingAngle: 30,
  similarityLock: 0,
  scale: 1,
  theoremCharge: 0,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function TriangleTensionLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<TriangleState>(initialState);
  const activeIndex = progress.activeIndex;

  const patchState = (patch: Partial<TriangleState>) => setState((current) => ({ ...current, ...patch }));
  const resetPanel = () => setState(initialState);
  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const checks = [
    state.angleA >= 76,
    state.missingAngle === 65,
    state.similarityLock >= 95,
    state.scale === 2,
    state.theoremCharge >= 95,
  ];

  const handleCheck = () => {
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Üçgen sahnesi doğru gerildi. Bir sonraki geometri katmanı açılıyor.',
      error: 'Üçgen hedefe oturmadı. Aktif sahnedeki ana kolu hedef işarete kadar sürükle.',
    });
  };

  return (
    <Grade9LabShell
      title="Üçgen Gerilim Laboratuvarı"
      subtitle="MAT.9.4.x / MAT.9.5.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#04110f] [background-image:radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(251,191,36,0.13),transparent_26%),linear-gradient(180deg,#04110f_0%,#071a16_58%,#030706_100%)]"
      badges={[
        { label: 'Açı', value: `${state.angleA}°`, tone: 'amber' },
        { label: 'Ölçek', value: `${state.scale}x`, tone: 'cyan' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <TriangleScene activeIndex={activeIndex} state={state} />
        <TriangleControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          state={state}
          setState={patchState}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

function TriangleScene({ activeIndex, state }: { activeIndex: number; state: TriangleState }) {
  const shape = useMemo(() => {
    const apex = {
      x: 355 + (state.angleA - 58) * 4.2,
      y: 255 - (state.angleA - 58) * 2.25,
    };
    const b = { x: 155, y: 405 };
    const c = { x: 565, y: 405 };
    const ab = Math.round(Math.hypot(apex.x - b.x, apex.y - b.y) / 18);
    const ac = Math.round(Math.hypot(c.x - apex.x, c.y - apex.y) / 18);
    const bc = Math.round(Math.hypot(c.x - b.x, c.y - b.y) / 18);
    return { apex, b, c, ab, ac, bc };
  }, [state.angleA]);

  const scaleWidth = 96 * state.scale;
  const scaleHeight = 72 * state.scale;
  const theorem = state.theoremCharge / 100;

  return (
    <section data-testid="triangle-scene" className="relative overflow-hidden rounded-[32px] border border-teal-200/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(45,212,191,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,212,191,0.13),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-teal-100/55">tek ana deney</p>
          <h2 className="text-2xl font-black text-white">İpleri Ger, Teoremi Gör</h2>
        </div>
        <div className="rounded-2xl border border-teal-200/25 bg-teal-200/10 px-4 py-2 font-mono text-sm font-black text-teal-100">
          AB {shape.ab} / AC {shape.ac} / BC {shape.bc}
        </div>
      </div>

      <svg viewBox="0 0 720 500" className="relative h-[520px] w-full rounded-[28px] border border-white/10 bg-[#020605]/70">
        <defs>
          <filter id="triangle-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M80 405 H640" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="8 12" />

        {activeIndex === 0 ? (
          <>
            <polygon points={`${shape.apex.x},${shape.apex.y} ${shape.b.x},${shape.b.y} ${shape.c.x},${shape.c.y}`} fill="rgba(45,212,191,0.08)" stroke="#2DD4BF" strokeWidth="5" strokeLinejoin="round" />
            <motion.line x1={shape.b.x} y1={shape.b.y} x2={shape.c.x} y2={shape.c.y} stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" filter="url(#triangle-glow)" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <circle cx={shape.apex.x} cy={shape.apex.y} r="18" fill="#00E5FF" stroke="#fff" strokeWidth="3" />
            <text x={shape.apex.x + 22} y={shape.apex.y - 8} fill="#fff" fontSize="18" fontWeight="900">A {state.angleA}°</text>
            <text x="360" y="448" textAnchor="middle" fill="#FBBF24" fontSize="20" fontWeight="900">A büyüdükçe karşısındaki BC ipi baskınlaşır</text>
          </>
        ) : null}

        {activeIndex === 1 ? (
          <>
            <path d="M150 370 C245 220 400 180 560 370" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="16" strokeLinecap="round" />
            <path d="M150 370 C245 220 400 180 560 370" fill="none" stroke="#2DD4BF" strokeWidth="5" strokeDasharray="12 12" />
            <line x1="150" y1="370" x2="560" y2="370" stroke="rgba(255,255,255,0.35)" strokeWidth="5" />
            <motion.line x1="150" y1="370" x2={150 + state.missingAngle * 4.2} y2={370 - state.missingAngle * 1.9} stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" filter="url(#triangle-glow)" />
            <text x="170" y="342" fill="#fff" fontSize="24" fontWeight="900">42°</text>
            <text x="500" y="342" fill="#fff" fontSize="24" fontWeight="900">73°</text>
            <text x="360" y="448" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="900">42 + 73 + {state.missingAngle} = {115 + state.missingAngle}°</text>
          </>
        ) : null}

        {activeIndex === 2 ? (
          <>
            <polygon points="165,390 345,390 245,190" fill="rgba(45,212,191,0.08)" stroke="#2DD4BF" strokeWidth="5" />
            <motion.polygon points="375,390 555,390 455,190" fill="rgba(179,136,255,0.09)" stroke="#B388FF" strokeWidth="5" animate={{ x: -2.1 * state.similarityLock, opacity: 0.35 + state.similarityLock / 160 }} />
            <circle cx="245" cy="190" r="18" fill="none" stroke="#FBBF24" strokeWidth="5" />
            <circle cx="455" cy="190" r="18" fill="none" stroke="#FBBF24" strokeWidth="5" />
            <text x="360" y="448" textAnchor="middle" fill="#B388FF" fontSize="20" fontWeight="900">Eş açılar üst üste geldiğinde şekiller aynı biçimdedir</text>
          </>
        ) : null}

        {activeIndex === 3 ? (
          <>
            <polygon points="160,385 256,385 160,313" fill="rgba(45,212,191,0.10)" stroke="#2DD4BF" strokeWidth="5" />
            <polygon points={`430,385 ${430 + scaleWidth},385 430,${385 - scaleHeight}`} fill="rgba(251,191,36,0.12)" stroke="#FBBF24" strokeWidth="5" />
            <polygon points="430,385 622,385 430,241" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="4" strokeDasharray="10 10" />
            <text x="202" y="425" textAnchor="middle" fill="#2DD4BF" fontSize="18" fontWeight="900">3-4-5</text>
            <text x="526" y="425" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="900">{state.scale}x büyütme</text>
          </>
        ) : null}

        {activeIndex === 4 ? (
          <>
            <polygon points="140,390 590,390 300,135" fill="rgba(45,212,191,0.08)" stroke="#2DD4BF" strokeWidth="5" />
            <motion.line x1="300" y1="135" x2={300 + 80 * theorem} y2={135 + 255 * theorem} stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" filter="url(#triangle-glow)" />
            <line x1="300" y1="135" x2="380" y2="390" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeDasharray="9 10" />
            <text x="240" y="420" fill="#fff" fontSize="18" fontWeight="900">p</text>
            <text x="475" y="420" fill="#fff" fontSize="18" fontWeight="900">k</text>
            <text x="360" y="448" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="900">{theorem > 0.9 ? 'h² = p·k' : 'yüksekliği hipotenüse indir'}</text>
          </>
        ) : null}
      </svg>
    </section>
  );
}

interface TriangleControlsProps {
  mission: MissionStep;
  activeIndex: number;
  state: TriangleState;
  setState: (patch: Partial<TriangleState>) => void;
  onCheck: () => void;
  onReset: () => void;
}

function TriangleControls({ mission, activeIndex, state, setState, onCheck, onReset }: TriangleControlsProps) {
  return (
    <aside className="rounded-[30px] border border-teal-200/18 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-teal-100/55">gerilim görevi {activeIndex + 1}/5</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-teal-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        {activeIndex === 0 ? <ExperimentSlider testId="triangle-angle-slider" label="A köşesini dışa çek" min={44} max={86} value={state.angleA} onChange={(value) => setState({ angleA: value })} completeValue={80} /> : null}
        {activeIndex === 1 ? <ExperimentSlider testId="triangle-missing-angle" label="eksik açıyı tamamla" min={30} max={90} value={state.missingAngle} onChange={(value) => setState({ missingAngle: value })} completeValue={65} /> : null}
        {activeIndex === 2 ? <ExperimentSlider testId="triangle-similarity-lock" label="hayalet üçgeni bindir" value={state.similarityLock} onChange={(value) => setState({ similarityLock: value })} completeValue={100} /> : null}
        {activeIndex === 3 ? <ExperimentSlider testId="triangle-scale" label="büyütme oranı" min={1} max={3} value={state.scale} onChange={(value) => setState({ scale: value })} completeValue={2} /> : null}
        {activeIndex === 4 ? <ExperimentSlider testId="triangle-theorem-drop" label="yüksekliği indir" value={state.theoremCharge} onChange={(value) => setState({ theoremCharge: value })} completeValue={100} /> : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="triangle-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Gerilimi Onayla
        </SciFiButton>
        <SciFiButton data-testid="triangle-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-xs leading-relaxed text-amber-50/70">
        <Triangle className="mb-2 h-4 w-4 text-amber-200" />
        Bu deneyde geometri cevabı karttan değil, üçgenin hareketinden okunur.
      </div>
    </aside>
  );
}

function ExperimentSlider({ testId, label, value, onChange, min = 0, max = 100, completeValue }: { testId: string; label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; completeValue: number }) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        {max <= 3 ? <Ruler className="h-4 w-4 text-[#2DD4BF]" /> : <MoveHorizontal className="h-4 w-4 text-[#2DD4BF]" />} {label}: {value}
      </span>
      <input data-testid={testId} type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} className="h-12 w-full accent-[#2DD4BF]" />
      <button type="button" data-testid={`${testId}-complete`} onClick={() => onChange(completeValue)} className="mt-3 min-h-[44px] w-full rounded-xl border border-teal-200/20 bg-teal-200/10 text-sm font-black uppercase tracking-wider text-teal-100 hover:border-teal-200/45">
        Hedefe Sürükle
      </button>
    </label>
  );
}
