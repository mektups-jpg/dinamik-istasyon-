import React, { useState } from 'react';
import { Check, Crosshair, FlipHorizontal2, LocateFixed, RotateCcw, ScanSearch } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'transformation-forensics';

const ATOM_IDS = ['MAT.9.5.1.1', 'MAT.9.5.1.2'];

const MISSIONS: MissionStep[] = [
  {
    id: 'rotation-center',
    title: 'Döndürme Merkezi',
    atomId: 'MAT.9.5.1.1',
    prompt: 'Orijinal parça ile döndürülmüş iz arasındaki eş uzaklıkları oku. Dönüşüm merkezi orijin olmalı.',
  },
  {
    id: 'rotation-angle',
    title: 'Açı İmzası',
    atomId: 'MAT.9.5.1.1',
    prompt: 'Parça saat yönünün tersine çeyrek tur dönmüş. Döndürme açısını 90° olarak kilitle.',
  },
  {
    id: 'reflection-axis',
    title: 'Ayna Ekseni',
    atomId: 'MAT.9.5.1.2',
    prompt: 'Yansıtılmış iz, Y ekseninin karşı tarafında simetrik duruyor. Ayna eksenini seç.',
  },
];

type CenterChoice = 'origin' | 'point-a' | 'point-b';
type AngleChoice = '90' | '180' | '270';
type AxisChoice = 'x-axis' | 'y-axis' | 'y-equals-x';

export default function TransformationForensicsApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [center, setCenter] = useState<CenterChoice>('point-a');
  const [angle, setAngle] = useState<AngleChoice>('180');
  const [axis, setAxis] = useState<AxisChoice>('x-axis');

  const resetPanel = () => {
    setCenter('point-a');
    setAngle('180');
    setAxis('x-axis');
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handleCheck = () => {
    const checks = [
      center === 'origin',
      angle === '90',
      axis === 'y-axis',
    ];

    progress.submitMission({
      ok: checks[progress.activeIndex] ?? false,
      success: 'Adli dönüşüm izi doğru eşleşti. Sonraki analiz katmanı açılıyor.',
      error: 'İzler çakışmadı. Merkez, açı veya ayna ekseni seçimlerini yeniden incele.',
    });
  };

  return (
    <Grade9LabShell
      title="Dönüşüm Adli Bilişimi"
      subtitle="MAT.9.5.1.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      frameClassName="bg-[#080713] [background-image:radial-gradient(circle_at_16%_18%,rgba(167,139,250,0.18),transparent_27%),radial-gradient(circle_at_82%_16%,rgba(0,229,255,0.10),transparent_24%),linear-gradient(180deg,#080713_0%,#100d1c_56%,#05050b_100%)]"
      badges={[
        { label: 'Merkez', value: centerLabel(center), tone: 'cyan' },
        { label: 'Açı', value: `${angle}°`, tone: 'amber' },
      ]}
    >
      <div className="space-y-4">
        <ForensicBrief activeMission={progress.activeMission} activeIndex={progress.activeIndex} total={MISSIONS.length} center={center} angle={angle} axis={axis} />
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 rounded-md border border-violet-200/15 bg-violet-950/20 p-4 shadow-[inset_0_0_35px_rgba(167,139,250,0.05)]">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill variant="forensic" label="Merkez Adayı" value={centerLabel(center)} tone="cyan" />
            <MetricPill variant="forensic" label="Döndürme" value={`${angle}°`} tone="purple" />
            <MetricPill variant="forensic" label="Ayna" value={axisLabel(axis)} tone="green" />
          </div>
          <ForensicsGrid activeIndex={progress.activeIndex} center={center} angle={angle} axis={axis} />
        </div>

        <div className="min-w-0 space-y-4">
          <PanelTitle icon={<LocateFixed className="h-4 w-4" />} title="Merkez Takibi" />
          <div className="grid gap-3">
            <ChoiceButton variant="forensic" testId="transform-center-origin" selected={center === 'origin'} label="Orijin (0,0)" detail="Eş uzaklık merkezi" onClick={() => setCenter('origin')} tone="cyan" />
            <ChoiceButton variant="forensic" testId="transform-center-point-a" selected={center === 'point-a'} label="A noktası" detail="Şeklin köşesi" onClick={() => setCenter('point-a')} tone="pink" />
            <ChoiceButton variant="forensic" testId="transform-center-point-b" selected={center === 'point-b'} label="B noktası" detail="İz köşesi" onClick={() => setCenter('point-b')} tone="pink" />
          </div>

          <PanelTitle icon={<RotateCcw className="h-4 w-4" />} title="Açı İmzası" />
          <div className="grid grid-cols-3 gap-3">
            {(['90', '180', '270'] as AngleChoice[]).map((value) => (
              <ChoiceButton variant="forensic" testId={`transform-angle-${value}`} key={value} selected={angle === value} label={`${value}°`} onClick={() => setAngle(value)} tone="amber" />
            ))}
          </div>

          <PanelTitle icon={<FlipHorizontal2 className="h-4 w-4" />} title="Ayna Ekseni" />
          <div className="grid gap-3">
            <ChoiceButton variant="forensic" testId="transform-axis-x" selected={axis === 'x-axis'} label="X ekseni" detail="Y koordinatı işaret değiştirir" onClick={() => setAxis('x-axis')} tone="purple" />
            <ChoiceButton variant="forensic" testId="transform-axis-y" selected={axis === 'y-axis'} label="Y ekseni" detail="X koordinatı işaret değiştirir" onClick={() => setAxis('y-axis')} tone="green" />
            <ChoiceButton variant="forensic" testId="transform-axis-y-equals-x" selected={axis === 'y-equals-x'} label="y=x" detail="Koordinatlar yer değiştirir" onClick={() => setAxis('y-equals-x')} tone="cyan" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="transform-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              İzi Eşleştir
            </SciFiButton>
            <SciFiButton data-testid="transform-reset" variant="secondary" onClick={resetPanel} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
      </div>
    </Grade9LabShell>
  );
}

function ForensicBrief({ activeMission, activeIndex, total, center, angle, axis }: { activeMission: MissionStep; activeIndex: number; total: number; center: CenterChoice; angle: AngleChoice; axis: AxisChoice }) {
  return (
    <section className="relative overflow-hidden rounded-md border border-violet-200/20 bg-violet-200/[0.045] p-5 shadow-[0_0_42px_rgba(167,139,250,0.10)]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-[repeating-linear-gradient(135deg,rgba(167,139,250,0.12)_0_1px,transparent_1px_12px)]" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-violet-100/65">adli iz dosyası {activeIndex + 1}/{total}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-50/70">{activeMission.prompt}</p>
        </div>
        <div className="grid w-full min-w-0 grid-cols-3 gap-2 rounded-md border border-violet-200/15 bg-black/35 p-3 font-mono text-xs font-black text-violet-50/80 lg:w-[280px] lg:shrink-0">
          <span>{centerLabel(center)}</span>
          <span>{angle}°</span>
          <span>{axisLabel(axis)}</span>
        </div>
      </div>
    </section>
  );
}

function centerLabel(center: CenterChoice): string {
  if (center === 'origin') return 'Orijin';
  if (center === 'point-a') return 'A noktası';
  return 'B noktası';
}

function axisLabel(axis: AxisChoice): string {
  if (axis === 'x-axis') return 'X ekseni';
  if (axis === 'y-axis') return 'Y ekseni';
  return 'y=x';
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
        <span className="text-[#00E5FF]">{icon}</span> {title}
      </h4>
    </div>
  );
}

interface ForensicsGridProps {
  activeIndex: number;
  center: CenterChoice;
  angle: AngleChoice;
  axis: AxisChoice;
}

type TransformPoint = [number, number];

const rotatePoint = ([x, y]: TransformPoint, [cx, cy]: TransformPoint, degrees: number): TransformPoint => {
  const angleRadians = (degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [
    cx + dx * Math.cos(angleRadians) - dy * Math.sin(angleRadians),
    cy + dx * Math.sin(angleRadians) + dy * Math.cos(angleRadians),
  ];
};

const reflectPoint = ([x, y]: TransformPoint, axis: AxisChoice): TransformPoint => {
  if (axis === 'y-axis') return [-x, y];
  if (axis === 'x-axis') return [x, -y];
  return [y, x];
};

function ForensicsGrid({ activeIndex, center, angle, axis }: ForensicsGridProps) {
  const rotationBase: TransformPoint[] = [[2, 1], [4, 1], [3, 3]];
  const reflectionBase: TransformPoint[] = [[2, -1], [4, -1], [3, -3]];
  const centerMap: Record<CenterChoice, TransformPoint> = {
    origin: [0, 0],
    'point-a': [2, 1],
    'point-b': [-1, 4],
  };
  const visualAngle = activeIndex === 0 ? '90' : angle;
  const isReflectionMission = activeIndex === 2;
  const basePoints = isReflectionMission ? reflectionBase : rotationBase;
  const targetPoints = isReflectionMission
    ? reflectionBase.map((point) => reflectPoint(point, 'y-axis'))
    : rotationBase.map((point) => rotatePoint(point, [0, 0], 90));
  const selectedPoints = isReflectionMission
    ? reflectionBase.map((point) => reflectPoint(point, axis))
    : rotationBase.map((point) => rotatePoint(point, centerMap[center], Number(visualAngle)));

  const toSvg = ([x, y]: TransformPoint) => `${220 + x * 34},${220 - y * 34}`;
  const targetPolygon = targetPoints.map(toSvg).join(' ');
  const selectedPolygon = selectedPoints.map(toSvg).join(' ');
  const basePolygon = basePoints.map(toSvg).join(' ');

  const selectedCenter = center === 'origin' ? [220, 220] : center === 'point-a' ? [288, 186] : [186, 84];
  const axisLine = axis === 'y-axis'
    ? { x1: 220, y1: 24, x2: 220, y2: 416 }
    : axis === 'x-axis'
      ? { x1: 24, y1: 220, x2: 416, y2: 220 }
      : { x1: 48, y1: 392, x2: 392, y2: 48 };

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/45 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.13),transparent_45%)]" />
      <svg viewBox="0 0 440 440" className="relative h-[390px] w-full">
        <defs>
          <pattern id="forensics-grid" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="440" height="440" fill="url(#forensics-grid)" />
        <line x1="0" y1="220" x2="440" y2="220" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <line x1="220" y1="0" x2="220" y2="440" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <line {...axisLine} stroke="#00FF88" strokeWidth="4" strokeDasharray="8 8" />
        <polygon points={basePolygon} fill="rgba(0,229,255,0.18)" stroke="#00E5FF" strokeWidth="4" />
        <polygon points={targetPolygon} fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeDasharray="10 8" />
        <motion.polygon
          points={selectedPolygon}
          fill={isReflectionMission ? 'rgba(0,255,136,0.14)' : 'rgba(179,136,255,0.18)'}
          stroke={isReflectionMission ? '#00FF88' : '#B388FF'}
          strokeWidth="4"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <circle cx={selectedCenter[0]} cy={selectedCenter[1]} r="11" fill="#FF0055" stroke="#fff" strokeWidth="3" />
        <text x={selectedCenter[0] + 16} y={selectedCenter[1] - 12} fill="#fff" fontWeight="900">{centerLabel(center)}</text>
        <text x="34" y="34" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">kesikli: hedef iz</text>
        <text x="34" y="54" fill={isReflectionMission ? '#00FF88' : '#B388FF'} fontSize="12" fontWeight="900">renkli: seçimin hayaleti</text>
      </svg>

      <div className="relative grid gap-3 md:grid-cols-3">
        <ForensicNote icon={<Crosshair className="h-4 w-4" />} title="Merkez" text="Dönen noktalar merkeze eş uzaklıktadır." />
        <ForensicNote icon={<RotateCcw className="h-4 w-4" />} title="Açı" text="Çeyrek tur, 90° dönüş izi bırakır." />
        <ForensicNote icon={<ScanSearch className="h-4 w-4" />} title="Ayna" text="Y ekseni x işaretini tersine çevirir." />
      </div>
    </div>
  );
}

function ForensicNote({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <div className="mb-1 flex items-center gap-2 text-sm font-black text-white">
        <span className="text-[#00E5FF]">{icon}</span> {title}
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
