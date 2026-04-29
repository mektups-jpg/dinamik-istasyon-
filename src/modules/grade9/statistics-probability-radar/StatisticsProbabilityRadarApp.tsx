import React, { useMemo, useState } from 'react';
import { BarChart3, Check, CircleDot, Gauge, Play, RotateCcw, Target } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'statistics-probability-radar';

const ATOM_IDS = [
  'MAT.9.6.1.1',
  'MAT.9.6.1.2',
  'MAT.9.6.2.1',
  'MAT.9.7.1.1',
  'MAT.9.7.2.1',
];

const MISSIONS: MissionStep[] = [
  {
    id: 'stable-group',
    title: 'Standart Sapma Radarı',
    atomId: 'MAT.9.6.2.1',
    prompt: 'Üç sınıfın not kümelerini karşılaştır. En dar dağılıma sahip, yani en istikrarlı grubu seç.',
  },
  {
    id: 'boxplot-label',
    title: 'Kutu-Bıyık Kapsülü',
    atomId: 'MAT.9.6.1.2',
    prompt: 'Kutu-bıyık grafiğinde veriyi ikiye bölen merkezi etiketi seç. Bu çizgi medyandır.',
  },
  {
    id: 'experimental-probability',
    title: 'Gözlemsel Olasılık',
    atomId: 'MAT.9.7.1.1',
    prompt: 'Deney çarkını en az 30 kez çalıştır ve gelen başarı oranına en yakın olasılığı seç.',
  },
  {
    id: 'induction-probability',
    title: 'Tümevarım Yayılımı',
    atomId: 'MAT.9.7.2.1',
    prompt: 'Deneysel oranı 1000 atışlık evrene genelle. Yaklaşık başarı sayısını seç.',
  },
];

type GroupChoice = 'A' | 'B' | 'C';
type BoxChoice = 'min' | 'q1' | 'median' | 'q3';
type ProbabilityChoice = '0.25' | '0.40' | '0.65';
type InductionChoice = '250' | '400' | '650';

const groups: Record<GroupChoice, number[]> = {
  A: [42, 60, 72, 88, 96],
  B: [67, 70, 72, 73, 76],
  C: [35, 54, 78, 92, 99],
};

const trialPattern = [true, false, false, true, false, true, false, false, true, false];

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const standardDeviation = (values: number[]) => {
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length);
};

export default function StatisticsProbabilityRadarApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [groupChoice, setGroupChoice] = useState<GroupChoice>('A');
  const [boxChoice, setBoxChoice] = useState<BoxChoice>('min');
  const [probabilityChoice, setProbabilityChoice] = useState<ProbabilityChoice>('0.25');
  const [inductionChoice, setInductionChoice] = useState<InductionChoice>('250');
  const [trials, setTrials] = useState(0);
  const [successes, setSuccesses] = useState(0);

  const observedProbability = trials === 0 ? 0 : successes / trials;
  const deviations = useMemo(() => ({
    A: standardDeviation(groups.A),
    B: standardDeviation(groups.B),
    C: standardDeviation(groups.C),
  }), []);

  const resetPanel = () => {
    setGroupChoice('A');
    setBoxChoice('min');
    setProbabilityChoice('0.25');
    setInductionChoice('250');
    setTrials(0);
    setSuccesses(0);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const runTrials = () => {
    let batchSuccess = 0;
    for (let i = 0; i < 10; i += 1) {
      if (trialPattern[(trials + i) % trialPattern.length]) {
        batchSuccess += 1;
      }
    }
    setTrials((current) => current + 10);
    setSuccesses((current) => current + batchSuccess);
  };

  const handleCheck = () => {
    const checks = [
      groupChoice === 'B',
      boxChoice === 'median',
      trials >= 30 && probabilityChoice === '0.40',
      trials >= 30 && inductionChoice === '400',
    ];

    progress.submitMission({
      ok: checks[progress.activeIndex] ?? false,
      success: 'Radar okuması doğru. Bir sonraki veri katmanı açıldı.',
      error: 'Veri yorumu hedefe uymadı. Dağılım genişliği, medyan veya deney sayısını tekrar kontrol et.',
    });
  };

  return (
    <Grade9LabShell
      title="Veri ve Olasılık Radarı"
      subtitle="MAT.9.6.1.x / MAT.9.6.2.x / MAT.9.7.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      frameClassName="bg-[#061006] [background-image:radial-gradient(circle_at_18%_18%,rgba(190,242,100,0.16),transparent_27%),radial-gradient(circle_at_80%_16%,rgba(0,229,255,0.10),transparent_24%),linear-gradient(180deg,#061006_0%,#07150d_55%,#030803_100%)]"
      badges={[
        { label: 'Deney', value: `${trials} atış`, tone: 'cyan' },
        { label: 'Oran', value: observedProbability.toFixed(2), tone: 'green' },
      ]}
    >
      <div className="space-y-4">
        <RadarBrief activeMission={progress.activeMission} activeIndex={progress.activeIndex} total={MISSIONS.length} trials={trials} observedProbability={observedProbability} />
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-[34px] border border-lime-200/15 bg-lime-950/20 p-4 shadow-[inset_0_0_35px_rgba(190,242,100,0.05)]">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill variant="radar" label="Sınıf A σ" value={deviations.A.toFixed(1)} tone="pink" />
            <MetricPill variant="radar" label="Sınıf B σ" value={deviations.B.toFixed(1)} tone="green" />
            <MetricPill variant="radar" label="Sınıf C σ" value={deviations.C.toFixed(1)} tone="purple" />
            <MetricPill variant="radar" label="Başarı" value={`${successes}/${trials || 0}`} tone="amber" />
          </div>
          <RadarVisual groupChoice={groupChoice} boxChoice={boxChoice} trials={trials} successes={successes} />
        </div>

        <div className="min-w-0 space-y-4">
          <PanelTitle icon={<Gauge className="h-4 w-4" />} title="İstikrarlı Grup" />
          <div className="grid grid-cols-3 gap-3">
            {(['A', 'B', 'C'] as GroupChoice[]).map((group) => (
              <ChoiceButton variant="radar" testId={`stats-group-${group.toLowerCase()}`} key={group} selected={groupChoice === group} label={`Sınıf ${group}`} detail={`σ=${deviations[group].toFixed(1)}`} onClick={() => setGroupChoice(group)} tone={group === 'B' ? 'green' : 'purple'} />
            ))}
          </div>

          <PanelTitle icon={<BarChart3 className="h-4 w-4" />} title="Kutu-Bıyık Etiketi" />
          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton variant="radar" testId="stats-box-min" selected={boxChoice === 'min'} label="Minimum" detail="En sol uç" onClick={() => setBoxChoice('min')} tone="pink" />
            <ChoiceButton variant="radar" testId="stats-box-q1" selected={boxChoice === 'q1'} label="Q1" detail="Alt çeyrek" onClick={() => setBoxChoice('q1')} tone="purple" />
            <ChoiceButton variant="radar" testId="stats-box-median" selected={boxChoice === 'median'} label="Medyan" detail="Ortadaki çizgi" onClick={() => setBoxChoice('median')} tone="green" />
            <ChoiceButton variant="radar" testId="stats-box-q3" selected={boxChoice === 'q3'} label="Q3" detail="Üst çeyrek" onClick={() => setBoxChoice('q3')} tone="purple" />
          </div>

          <PanelTitle icon={<CircleDot className="h-4 w-4" />} title="Deneysel Olasılık" />
          <SciFiButton data-testid="stats-run-trials" variant="secondary" onClick={runTrials} className="min-h-[48px] w-full" icon={<Play className="h-4 w-4" />}>
            10 Deney Çalıştır
          </SciFiButton>
          <div className="grid grid-cols-3 gap-3">
            {(['0.25', '0.40', '0.65'] as ProbabilityChoice[]).map((value) => (
              <ChoiceButton variant="radar" testId={`stats-prob-${value.replace('.', '-')}`} key={value} selected={probabilityChoice === value} label={value} detail="P(başarı)" onClick={() => setProbabilityChoice(value)} tone="cyan" />
            ))}
          </div>

          <PanelTitle icon={<Target className="h-4 w-4" />} title="Tümevarım" />
          <div className="grid grid-cols-3 gap-3">
            {(['250', '400', '650'] as InductionChoice[]).map((value) => (
              <ChoiceButton variant="radar" testId={`stats-induction-${value}`} key={value} selected={inductionChoice === value} label={value} detail="/1000" onClick={() => setInductionChoice(value)} tone="amber" />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="stats-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              Veriyi Onayla
            </SciFiButton>
            <SciFiButton data-testid="stats-reset" variant="secondary" onClick={resetPanel} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
      </div>
    </Grade9LabShell>
  );
}

function RadarBrief({ activeMission, activeIndex, total, trials, observedProbability }: { activeMission: MissionStep; activeIndex: number; total: number; trials: number; observedProbability: number }) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-lime-200/20 bg-lime-200/[0.045] p-5 shadow-[0_0_42px_rgba(190,242,100,0.10)]">
      <div className="pointer-events-none absolute right-8 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-lime-200/15" />
      <div className="pointer-events-none absolute right-16 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-lime-200/15" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-lime-100/65">radar taraması {activeIndex + 1}/{total}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-lime-50/70">{activeMission.prompt}</p>
        </div>
        <div className="w-full min-w-0 rounded-3xl border border-lime-200/15 bg-black/35 p-3 lg:w-[250px] lg:shrink-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lime-100/55">deney sinyali</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-3xl font-black text-lime-100">{trials}</span>
            <span className="rounded-full border border-lime-200/25 px-3 py-1 font-mono text-xs font-black text-lime-100">{observedProbability.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
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

interface RadarVisualProps {
  groupChoice: GroupChoice;
  boxChoice: BoxChoice;
  trials: number;
  successes: number;
}

function RadarVisual({ groupChoice, boxChoice, trials, successes }: RadarVisualProps) {
  const values = groups[groupChoice];
  const observed = trials === 0 ? 0 : successes / trials;
  const box = { min: 42, q1: 55, median: 70, q3: 82, max: 96 };
  const scale = (value: number) => 60 + value * 3.1;
  const arcRadius = 72;
  const arcStart = -Math.PI / 2;
  const arcEnd = arcStart + observed * Math.PI * 2;
  const arcStartX = 470 + Math.cos(arcStart) * arcRadius;
  const arcStartY = 218 + Math.sin(arcStart) * arcRadius;
  const arcEndX = 470 + Math.cos(arcEnd) * arcRadius;
  const arcEndY = 218 + Math.sin(arcEnd) * arcRadius;
  const largeArcFlag = observed > 0.5 ? 1 : 0;
  const probabilityArc = `M${arcStartX} ${arcStartY} A${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}`;

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/45 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,229,255,0.13),transparent_46%)]" />
      <svg viewBox="0 0 640 390" className="relative h-[350px] w-full">
        <defs>
          <filter id="stats-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 1, 2].map((ring) => (
          <circle key={ring} cx="185" cy="170" r={52 + ring * 42} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        ))}
        {values.map((value, index) => {
          const angle = (index / values.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 34 + value * 1.25;
          const x = 185 + Math.cos(angle) * radius;
          const y = 170 + Math.sin(angle) * radius;
          return (
            <motion.circle
              key={`${value}-${index}`}
              cx={x}
              cy={y}
              r="9"
              fill={groupChoice === 'B' ? '#00FF88' : '#B388FF'}
              filter="url(#stats-glow)"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ delay: index * 0.08, duration: 1.2, repeat: Infinity }}
            />
          );
        })}
        <text x="185" y="176" textAnchor="middle" fill="#fff" fontWeight="900">Sınıf {groupChoice}</text>

        <line x1={scale(box.min)} y1="300" x2={scale(box.max)} y2="300" stroke="rgba(255,255,255,0.45)" strokeWidth="4" />
        <rect x={scale(box.q1)} y="260" width={scale(box.q3) - scale(box.q1)} height="80" rx="10" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="3" />
        <line x1={scale(box.median)} y1="252" x2={scale(box.median)} y2="348" stroke={boxChoice === 'median' ? '#00FF88' : '#fff'} strokeWidth="6" />
        <circle cx={scale(box.min)} cy="300" r="7" fill="#FF6B9A" />
        <circle cx={scale(box.max)} cy="300" r="7" fill="#FF6B9A" />

        {observed > 0 ? (
          <motion.path
            d={probabilityArc}
            fill="none"
            stroke="#00FF88"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#stats-glow)"
          />
        ) : null}
        <circle cx="470" cy="218" r="54" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.28)" strokeWidth="2" />
        <text x="470" y="212" textAnchor="middle" fill="#00FF88" fontSize="26" fontWeight="900">{observed.toFixed(2)}</text>
        <text x="470" y="236" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="900">P(başarı)</text>
      </svg>

      <div className="relative grid gap-3 md:grid-cols-3">
        <InfoCard title="σ Daralır" text="Sapma küçüldükçe grup daha istikrarlı görünür." />
        <InfoCard title="Medyan" text="Kutu içindeki çizgi veriyi iki yarıya böler." />
        <InfoCard title="Deney" text="Gözlenen oran büyüyen örneklemle evrene yayılır." />
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
