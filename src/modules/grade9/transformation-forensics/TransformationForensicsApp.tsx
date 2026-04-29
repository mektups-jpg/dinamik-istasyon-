import React, { useMemo, useState } from 'react';
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
      badges={[
        { label: 'Merkez', value: centerLabel(center), tone: 'cyan' },
        { label: 'Açı', value: `${angle}°`, tone: 'amber' },
      ]}
    >
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#07101e]/80 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill label="Merkez Adayı" value={centerLabel(center)} tone="cyan" />
            <MetricPill label="Döndürme" value={`${angle}°`} tone="purple" />
            <MetricPill label="Ayna" value={axisLabel(axis)} tone="green" />
          </div>
          <ForensicsGrid center={center} angle={angle} axis={axis} />
        </div>

        <div className="min-w-0 space-y-4">
          <PanelTitle icon={<LocateFixed className="h-4 w-4" />} title="Merkez Takibi" />
          <div className="grid gap-3">
            <ChoiceButton testId="transform-center-origin" selected={center === 'origin'} label="Orijin (0,0)" detail="Eş uzaklık merkezi" onClick={() => setCenter('origin')} tone="cyan" />
            <ChoiceButton testId="transform-center-point-a" selected={center === 'point-a'} label="A noktası" detail="Şeklin köşesi" onClick={() => setCenter('point-a')} tone="pink" />
            <ChoiceButton testId="transform-center-point-b" selected={center === 'point-b'} label="B noktası" detail="İz köşesi" onClick={() => setCenter('point-b')} tone="pink" />
          </div>

          <PanelTitle icon={<RotateCcw className="h-4 w-4" />} title="Açı İmzası" />
          <div className="grid grid-cols-3 gap-3">
            {(['90', '180', '270'] as AngleChoice[]).map((value) => (
              <ChoiceButton testId={`transform-angle-${value}`} key={value} selected={angle === value} label={`${value}°`} onClick={() => setAngle(value)} tone="amber" />
            ))}
          </div>

          <PanelTitle icon={<FlipHorizontal2 className="h-4 w-4" />} title="Ayna Ekseni" />
          <div className="grid gap-3">
            <ChoiceButton testId="transform-axis-x" selected={axis === 'x-axis'} label="X ekseni" detail="Y koordinatı işaret değiştirir" onClick={() => setAxis('x-axis')} tone="purple" />
            <ChoiceButton testId="transform-axis-y" selected={axis === 'y-axis'} label="Y ekseni" detail="X koordinatı işaret değiştirir" onClick={() => setAxis('y-axis')} tone="green" />
            <ChoiceButton testId="transform-axis-y-equals-x" selected={axis === 'y-equals-x'} label="y=x" detail="Koordinatlar yer değiştirir" onClick={() => setAxis('y-equals-x')} tone="cyan" />
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
    </Grade9LabShell>
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
  center: CenterChoice;
  angle: AngleChoice;
  axis: AxisChoice;
}

function ForensicsGrid({ center, angle, axis }: ForensicsGridProps) {
  const rotationPoints = useMemo(() => {
    const base = [
      [2, 1],
      [4, 1],
      [3, 3],
    ];
    return base.map(([x, y]) => [-y, x]);
  }, []);

  const reflectionPoints = useMemo(() => {
    const base = [
      [2, -1],
      [4, -1],
      [3, -3],
    ];
    return base.map(([x, y]) => [-x, y]);
  }, []);

  const toSvg = ([x, y]: number[]) => `${220 + x * 34},${220 - y * 34}`;
  const rotationPolygon = rotationPoints.map(toSvg).join(' ');
  const reflectionPolygon = reflectionPoints.map(toSvg).join(' ');
  const basePolygon = [[2, 1], [4, 1], [3, 3]].map(toSvg).join(' ');

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
        <motion.polygon
          points={rotationPolygon}
          fill="rgba(179,136,255,0.18)"
          stroke="#B388FF"
          strokeWidth="4"
          animate={{ opacity: angle === '90' ? [0.75, 1, 0.75] : 0.45 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.polygon
          points={reflectionPolygon}
          fill="rgba(0,255,136,0.14)"
          stroke="#00FF88"
          strokeWidth="4"
          animate={{ opacity: axis === 'y-axis' ? [0.65, 1, 0.65] : 0.38 }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <circle cx={selectedCenter[0]} cy={selectedCenter[1]} r="11" fill="#FF0055" stroke="#fff" strokeWidth="3" />
        <text x={selectedCenter[0] + 16} y={selectedCenter[1] - 12} fill="#fff" fontWeight="900">{centerLabel(center)}</text>
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
