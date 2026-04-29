import { useMemo, useState } from 'react';
import { Check, Crosshair, FlipHorizontal2, RotateCcw, ScanSearch } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'transformation-forensics';

const ATOM_IDS = ['MAT.9.5.1.1', 'MAT.9.5.1.2'];

const MISSIONS: MissionStep[] = [
  { id: 'rotation-center', title: 'Döndürme Merkezi', atomId: 'MAT.9.5.1.1', prompt: 'Döndürme merkezini sürükle. Hayalet şekil hedef iz ile ancak merkez orijindeyken çakışır.' },
  { id: 'rotation-angle', title: 'Açı İmzası', atomId: 'MAT.9.5.1.1', prompt: 'Açı halkasını çevir. İz saat yönünün tersine 90° döndürme ile kilitlenir.' },
  { id: 'reflection-axis', title: 'Ayna Ekseni', atomId: 'MAT.9.5.1.2', prompt: 'Ayna eksenini seç. Y ekseni doğru olduğunda yansıyan hayalet iz ile üst üste gelir.' },
];

type AxisChoice = 'x-axis' | 'y-axis' | 'y-equals-x';
type Point = [number, number];

const rotationBase: Point[] = [[2, 1], [4, 1], [3, 3]];
const reflectionBase: Point[] = [[2, -1], [4, -1], [3, -3]];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const rotatePoint = ([x, y]: Point, [cx, cy]: Point, degrees: number): Point => {
  const radians = (degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [
    cx + dx * Math.cos(radians) - dy * Math.sin(radians),
    cy + dx * Math.sin(radians) + dy * Math.cos(radians),
  ];
};

const reflectPoint = ([x, y]: Point, axis: AxisChoice): Point => {
  if (axis === 'y-axis') return [-x, y];
  if (axis === 'x-axis') return [x, -y];
  return [y, x];
};

const toSvgPoint = ([x, y]: Point) => `${220 + x * 34},${220 - y * 34}`;

export default function TransformationForensicsApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [centerX, setCenterX] = useState(1);
  const [centerY, setCenterY] = useState(1);
  const [angle, setAngle] = useState(180);
  const [axis, setAxis] = useState<AxisChoice>('x-axis');
  const activeIndex = progress.activeIndex;

  const resetPanel = () => {
    setCenterX(1);
    setCenterY(1);
    setAngle(180);
    setAxis('x-axis');
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const checks = [
    centerX === 0 && centerY === 0,
    angle === 90,
    axis === 'y-axis',
  ];

  const handleCheck = () => {
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Adli iz doğru çakıştı. Bir sonraki dönüşüm katmanı açılıyor.',
      error: 'Hayalet şekil hedef iz ile çakışmadı. Merkez, açı veya ekseni yeniden ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Dönüşüm Adli Bilişimi"
      subtitle="MAT.9.5.1.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#080713] [background-image:radial-gradient(circle_at_18%_18%,rgba(167,139,250,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(0,229,255,0.11),transparent_26%),linear-gradient(180deg,#080713_0%,#100d1c_58%,#05050b_100%)]"
      badges={[
        { label: 'Merkez', value: `(${centerX},${centerY})`, tone: 'cyan' },
        { label: 'Açı', value: `${angle}°`, tone: 'amber' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ForensicsScene activeIndex={activeIndex} centerX={centerX} centerY={centerY} angle={angle} axis={axis} />
        <ForensicsControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          centerX={centerX}
          centerY={centerY}
          angle={angle}
          axis={axis}
          setCenterX={setCenterX}
          setCenterY={setCenterY}
          setAngle={setAngle}
          setAxis={setAxis}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

interface ForensicsSceneProps {
  activeIndex: number;
  centerX: number;
  centerY: number;
  angle: number;
  axis: AxisChoice;
}

function ForensicsScene({ activeIndex, centerX, centerY, angle, axis }: ForensicsSceneProps) {
  const isReflection = activeIndex === 2;
  const center: Point = [centerX, centerY];
  const visualAngle = activeIndex === 0 ? 90 : angle;
  const base = isReflection ? reflectionBase : rotationBase;

  const target = useMemo(() => (
    isReflection ? reflectionBase.map((point) => reflectPoint(point, 'y-axis')) : rotationBase.map((point) => rotatePoint(point, [0, 0], 90))
  ), [isReflection]);

  const selected = useMemo(() => (
    isReflection ? reflectionBase.map((point) => reflectPoint(point, axis)) : rotationBase.map((point) => rotatePoint(point, center, visualAngle))
  ), [axis, centerX, centerY, isReflection, visualAngle]);

  const basePolygon = base.map(toSvgPoint).join(' ');
  const targetPolygon = target.map(toSvgPoint).join(' ');
  const selectedPolygon = selected.map(toSvgPoint).join(' ');
  const centerSvg = { x: 220 + centerX * 34, y: 220 - centerY * 34 };
  const axisLine = axis === 'y-axis'
    ? { x1: 220, y1: 26, x2: 220, y2: 414 }
    : axis === 'x-axis'
      ? { x1: 26, y1: 220, x2: 414, y2: 220 }
      : { x1: 52, y1: 388, x2: 388, y2: 52 };

  return (
    <section data-testid="transform-scene" className="relative overflow-hidden rounded-[18px] border border-violet-200/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(167,139,250,0.10)]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-[repeating-linear-gradient(135deg,rgba(167,139,250,0.12)_0_1px,transparent_1px_12px)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-violet-100/55">tek ana deney</p>
          <h2 className="text-2xl font-black text-white">Hedef İzi Hayaletle Çakıştır</h2>
        </div>
        <div className="rounded-xl border border-violet-200/25 bg-violet-200/10 px-4 py-2 font-mono text-sm font-black text-violet-100">
          {isReflection ? axisLabel(axis) : `(${centerX},${centerY}) / ${visualAngle}°`}
        </div>
      </div>

      <svg viewBox="0 0 440 440" className="relative h-[560px] w-full rounded-2xl border border-white/10 bg-[#05040b]/78">
        <defs>
          <pattern id="forensics-grid-v3" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
          <filter id="forensics-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="440" height="440" fill="url(#forensics-grid-v3)" />
        <line x1="24" y1="220" x2="416" y2="220" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <line x1="220" y1="24" x2="220" y2="416" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        {isReflection ? <line {...axisLine} stroke="#00E5FF" strokeWidth="5" strokeDasharray="10 10" /> : null}
        <polygon points={basePolygon} fill="rgba(0,229,255,0.10)" stroke="#00E5FF" strokeWidth="4" />
        <polygon points={targetPolygon} fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.58)" strokeWidth="5" strokeDasharray="12 10" />
        <motion.polygon points={selectedPolygon} fill="rgba(179,136,255,0.16)" stroke="#B388FF" strokeWidth="5" filter="url(#forensics-glow)" animate={{ opacity: [0.58, 1, 0.58] }} transition={{ duration: 1.2, repeat: Infinity }} />
        {!isReflection ? (
          <>
            <circle cx={centerSvg.x} cy={centerSvg.y} r="16" fill="#FBBF24" stroke="#fff" strokeWidth="3" />
            <path d="M280 220 A60 60 0 0 0 220 160" fill="none" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" strokeDasharray="7 8" />
            <text x={centerSvg.x + 22} y={centerSvg.y - 12} fill="#FBBF24" fontSize="15" fontWeight="900">merkez</text>
          </>
        ) : null}
        <text x="220" y="410" textAnchor="middle" fill="#B388FF" fontSize="17" fontWeight="900">
          {isReflection ? 'Doğru eksen seçilince yansıma hedef iz ile çakışır' : 'Merkez ve açı doğruysa hayalet hedefe kilitlenir'}
        </text>
      </svg>
    </section>
  );
}

interface ForensicsControlsProps {
  mission: MissionStep;
  activeIndex: number;
  centerX: number;
  centerY: number;
  angle: number;
  axis: AxisChoice;
  setCenterX: (value: number) => void;
  setCenterY: (value: number) => void;
  setAngle: (value: number) => void;
  setAxis: (value: AxisChoice) => void;
  onCheck: () => void;
  onReset: () => void;
}

function ForensicsControls(props: ForensicsControlsProps) {
  const { mission, activeIndex, centerX, centerY, angle, axis, setCenterX, setCenterY, setAngle, setAxis, onCheck, onReset } = props;
  return (
    <aside className="rounded-[18px] border border-violet-200/18 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-violet-100/55">adli dosya {activeIndex + 1}/3</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-violet-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        {activeIndex === 0 ? (
          <div className="space-y-4">
            <ExperimentSlider testId="transform-center-x" label="merkez x" min={-2} max={2} value={centerX} onChange={setCenterX} completeValue={0} />
            <ExperimentSlider testId="transform-center-y" label="merkez y" min={-2} max={2} value={centerY} onChange={setCenterY} completeValue={0} />
            <button data-testid="transform-center-origin" onClick={() => { setCenterX(0); setCenterY(0); }} className="min-h-[46px] w-full rounded-xl border border-violet-200/20 bg-violet-200/10 text-sm font-black uppercase tracking-wider text-violet-100 hover:border-violet-200/45">Orijine Kilitle</button>
          </div>
        ) : null}
        {activeIndex === 1 ? <ExperimentSlider testId="transform-angle-slider" label="açı halkası" min={0} max={270} value={angle} onChange={setAngle} completeValue={90} step={45} /> : null}
        {activeIndex === 2 ? (
          <div className="grid gap-3">
            <AxisButton testId="transform-axis-x" selected={axis === 'x-axis'} label="X ekseni" onClick={() => setAxis('x-axis')} />
            <AxisButton testId="transform-axis-y" selected={axis === 'y-axis'} label="Y ekseni" onClick={() => setAxis('y-axis')} />
            <AxisButton testId="transform-axis-y-equals-x" selected={axis === 'y-equals-x'} label="y=x" onClick={() => setAxis('y-equals-x')} />
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="transform-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          İzi Eşleştir
        </SciFiButton>
        <SciFiButton data-testid="transform-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-xs leading-relaxed text-cyan-50/70">
        {activeIndex === 2 ? <FlipHorizontal2 className="mb-2 h-4 w-4 text-cyan-200" /> : <ScanSearch className="mb-2 h-4 w-4 text-cyan-200" />}
        Dönüşüm burada ezber değil; hedef iz ile hayalet şekli üst üste getirme işidir.
      </div>
    </aside>
  );
}

function ExperimentSlider({ testId, label, value, onChange, min, max, completeValue, step = 1 }: { testId: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; completeValue: number; step?: number }) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <Crosshair className="h-4 w-4 text-[#B388FF]" /> {label}: {value}
      </span>
      <input data-testid={testId} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} className="h-12 w-full accent-[#B388FF]" />
      <button type="button" data-testid={`${testId}-complete`} onClick={() => onChange(completeValue)} className="mt-3 min-h-[44px] w-full rounded-xl border border-violet-200/20 bg-violet-200/10 text-sm font-black uppercase tracking-wider text-violet-100 hover:border-violet-200/45">
        Hedefe Sürükle
      </button>
    </label>
  );
}

function AxisButton({ testId, selected, label, onClick }: { testId: string; selected: boolean; label: string; onClick: () => void }) {
  return (
    <button data-testid={testId} onClick={onClick} className={`min-h-[58px] rounded-xl border px-4 text-left font-black transition ${selected ? 'border-[#00E5FF]/45 bg-[#00E5FF]/12 text-cyan-100' : 'border-white/10 bg-white/5 text-white/75 hover:border-[#00E5FF]/35'}`}>
      {label}
    </button>
  );
}

function axisLabel(axis: AxisChoice): string {
  if (axis === 'y-axis') return 'Y ekseni';
  if (axis === 'x-axis') return 'X ekseni';
  return 'y=x';
}
