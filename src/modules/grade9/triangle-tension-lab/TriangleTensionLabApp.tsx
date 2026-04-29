import React, { useMemo, useState } from 'react';
import { Check, MoveHorizontal, Ruler, RotateCcw, Triangle } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
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
  {
    id: 'angle-side',
    title: 'Açı-Kenar Gerilimi',
    atomId: 'MAT.9.4.1.1',
    prompt: 'A açısını büyüt ve karşısındaki BC kenarının en uzun ip olduğunu seç. Büyük açı, karşısında büyük kenar üretir.',
  },
  {
    id: 'angle-sum',
    title: 'İç Açı Denklemi',
    atomId: 'MAT.9.4.1.2',
    prompt: '42° ve 73° verilen üçgende eksik açıyı hesapla. İç açılar toplamı 180° olmalı.',
  },
  {
    id: 'similarity-angle',
    title: 'Benzerlik Açı Kilidi',
    atomId: 'MAT.9.5.2.1',
    prompt: 'İki üçgenin benzer olması için eşleşen açıların eşit olduğunu doğrulayan şartı seç.',
  },
  {
    id: 'similarity-side',
    title: 'Oranlı Kenar Kilidi',
    atomId: 'MAT.9.5.2.2',
    prompt: '3-4-5 üçgeni 6-8-10 üçgenine büyüdü. Sabit büyüme oranını seç.',
  },
  {
    id: 'theorem-lock',
    title: 'Teorem Kasası',
    atomId: 'MAT.9.5.3.2',
    prompt: 'Dik üçgende yüksekliğin hipotenüsü böldüğü parçalar p ve k ise h²=p·k kodunu veren teoremi seç.',
  },
];

type SideChoice = 'AB' | 'AC' | 'BC';
type AnswerKey = 'missingAngle' | 'similarity' | 'ratio' | 'theorem';

const ANSWERS: Record<AnswerKey, string> = {
  missingAngle: '65',
  similarity: 'AAA',
  ratio: '2',
  theorem: 'Euclid',
};

const clampAngle = (value: number) => Math.min(86, Math.max(42, value));

export default function TriangleTensionLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [angleA, setAngleA] = useState(62);
  const [sideChoice, setSideChoice] = useState<SideChoice>('AB');
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    missingAngle: '',
    similarity: '',
    ratio: '',
    theorem: '',
  });

  const triangle = useMemo(() => {
    const ax = 200 + (angleA - 62) * 1.15;
    const ay = 86 + Math.max(0, 82 - angleA) * 0.8;
    const ab = Math.round(Math.hypot(ax - 75, ay - 286));
    const ac = Math.round(Math.hypot(325 - ax, 286 - ay));
    const bc = 250;
    return { ax, ay, ab, ac, bc };
  }, [angleA]);

  const setAnswer = (key: AnswerKey, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const resetPanel = () => {
    setAngleA(62);
    setSideChoice('AB');
    setAnswers({ missingAngle: '', similarity: '', ratio: '', theorem: '' });
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handleCheck = () => {
    const checks = [
      angleA >= 76 && sideChoice === 'BC',
      answers.missingAngle === ANSWERS.missingAngle,
      answers.similarity === ANSWERS.similarity,
      answers.ratio === ANSWERS.ratio,
      answers.theorem === ANSWERS.theorem,
    ];

    progress.submitMission({
      ok: checks[progress.activeIndex] ?? false,
      success: 'Üçgen gerilimi doğru okundu. Sıradaki geometri kilidi açıldı.',
      error: 'Üçgen hedefe oturmadı. Açı, karşı kenar, oran veya teorem seçimini tekrar kontrol et.',
    });
  };

  return (
    <Grade9LabShell
      title="Üçgen Gerilim Laboratuvarı"
      subtitle="MAT.9.4.1.x / MAT.9.5.2.x / MAT.9.5.3.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      frameClassName="bg-[#04110f] [background-image:radial-gradient(circle_at_17%_18%,rgba(45,212,191,0.16),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(251,191,36,0.12),transparent_24%),linear-gradient(180deg,#04110f_0%,#061916_54%,#030806_100%)]"
      badges={[
        { label: 'A Açısı', value: `${angleA}°`, tone: 'amber' },
        { label: 'Seçili Kenar', value: sideChoice, tone: 'cyan' },
      ]}
    >
      <div className="space-y-4">
        <TensionBrief activeMission={progress.activeMission} activeIndex={progress.activeIndex} total={MISSIONS.length} angleA={angleA} sideChoice={sideChoice} />
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-[30px] border border-teal-200/15 bg-teal-950/20 p-4 shadow-[inset_0_0_35px_rgba(45,212,191,0.05)]">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill variant="tension" label="AB" value={String(triangle.ab)} tone="purple" />
            <MetricPill variant="tension" label="AC" value={String(triangle.ac)} tone="green" />
            <MetricPill variant="tension" label="BC" value={String(triangle.bc)} tone="cyan" />
            <MetricPill variant="tension" label="Oran" value="6/3 = 2" tone="amber" />
          </div>
          <TriangleVisual angleA={angleA} sideChoice={sideChoice} triangle={triangle} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-[30px] border border-teal-200/15 bg-teal-200/[0.045] p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <MoveHorizontal className="h-4 w-4 text-[#00E5FF]" /> Açı Gerilim Sürgüsü
            </h4>
            <div className="flex items-center gap-3">
              <motion.button
                data-testid="triangle-angle-minus"
                whileTap={{ scale: 0.94 }}
                onClick={() => setAngleA((current) => clampAngle(current - 4))}
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-xl font-black hover:border-[#00E5FF]/40"
              >
                -
              </motion.button>
              <input
                data-testid="triangle-angle"
                aria-label="A açısı"
                min={42}
                max={86}
                value={angleA}
                onChange={(event) => setAngleA(Number(event.target.value))}
                type="range"
                className="h-12 min-w-0 flex-1 accent-[#00E5FF]"
              />
              <motion.button
                data-testid="triangle-angle-plus"
                whileTap={{ scale: 0.94 }}
                onClick={() => setAngleA((current) => clampAngle(current + 4))}
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-xl font-black hover:border-[#00E5FF]/40"
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['AB', 'AC', 'BC'] as SideChoice[]).map((side) => (
              <ChoiceButton variant="tension" testId={`triangle-side-${side.toLowerCase()}`} key={side} selected={sideChoice === side} label={side} detail="Karşı/en uzun kenar" onClick={() => setSideChoice(side)} tone="cyan" />
            ))}
          </div>

          <AnswerPanel answers={answers} setAnswer={setAnswer} />

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="triangle-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              Geometriyi Onayla
            </SciFiButton>
            <SciFiButton data-testid="triangle-reset" variant="secondary" onClick={resetPanel} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
      </div>
    </Grade9LabShell>
  );
}

function TensionBrief({ activeMission, activeIndex, total, angleA, sideChoice }: { activeMission: MissionStep; activeIndex: number; total: number; angleA: number; sideChoice: SideChoice }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-teal-200/20 bg-teal-200/[0.045] p-5 shadow-[0_0_42px_rgba(45,212,191,0.10)]">
      <div className="pointer-events-none absolute right-6 top-5 h-24 w-32 border-b border-l border-teal-200/20" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-teal-100/65">gerilim testi {activeIndex + 1}/{total}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-teal-50/70">{activeMission.prompt}</p>
        </div>
        <div className="w-full min-w-0 rounded-3xl border border-teal-200/15 bg-black/30 p-3 lg:w-[250px] lg:shrink-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal-100/55">ip gerilimi</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-3xl font-black text-teal-100">A {angleA}°</span>
            <span className="rounded-full border border-teal-200/25 px-3 py-1 font-mono text-xs font-black text-teal-100">{sideChoice}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TriangleShape {
  ax: number;
  ay: number;
  ab: number;
  ac: number;
  bc: number;
}

interface TriangleVisualProps {
  angleA: number;
  sideChoice: SideChoice;
  triangle: TriangleShape;
}

function TriangleVisual({ angleA, sideChoice, triangle }: TriangleVisualProps) {
  const sideStroke = (side: SideChoice) => sideChoice === side ? '#00E5FF' : 'rgba(255,255,255,0.45)';

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/45 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,136,0.13),transparent_44%)]" />
      <svg viewBox="0 0 400 360" className="relative h-[330px] w-full">
        <defs>
          <filter id="triangle-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.line x1="75" y1="286" x2={triangle.ax} y2={triangle.ay} stroke={sideStroke('AB')} strokeWidth="7" strokeLinecap="round" filter="url(#triangle-glow)" />
        <motion.line x1={triangle.ax} y1={triangle.ay} x2="325" y2="286" stroke={sideStroke('AC')} strokeWidth="7" strokeLinecap="round" filter="url(#triangle-glow)" />
        <motion.line x1="75" y1="286" x2="325" y2="286" stroke={sideStroke('BC')} strokeWidth="7" strokeLinecap="round" filter="url(#triangle-glow)" />
        <circle cx={triangle.ax} cy={triangle.ay} r="9" fill="#00FF88" />
        <circle cx="75" cy="286" r="9" fill="#B388FF" />
        <circle cx="325" cy="286" r="9" fill="#B388FF" />
        <text x={triangle.ax} y={triangle.ay - 16} textAnchor="middle" fill="#fff" fontWeight="900">A {angleA}°</text>
        <text x="56" y="314" fill="#fff" fontWeight="900">B 42°</text>
        <text x="310" y="314" fill="#fff" fontWeight="900">C</text>
        <path d="M236 286 L236 226" stroke="rgba(255,255,255,0.35)" strokeDasharray="6 7" strokeWidth="3" />
        <text x="246" y="258" fill="#00E5FF" fontSize="13" fontWeight="900">h²=p·k</text>
      </svg>

      <div className="relative grid gap-3 md:grid-cols-3">
        <MiniProof title="Açı-Kenar" text="Büyük açı karşısındaki ipi uzatır." />
        <MiniProof title="Benzerlik" text="AAA ve sabit oran aynı şekli korur." />
        <MiniProof title="Teorem" text="Tales, Öklid ve Pisagor dik üçgende kod üretir." />
      </div>
    </div>
  );
}

function MiniProof({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <div className="mb-1 flex items-center gap-2 text-sm font-black text-white">
        <Triangle className="h-4 w-4 text-[#00E5FF]" /> {title}
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

interface AnswerPanelProps {
  answers: Record<AnswerKey, string>;
  setAnswer: (key: AnswerKey, value: string) => void;
}

function AnswerPanel({ answers, setAnswer }: AnswerPanelProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
        <Ruler className="h-4 w-4 text-[#B388FF]" /> Kilit Cevapları
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {['55', '65', '75', '115'].map((value) => (
          <ChoiceButton variant="tension" testId={`triangle-angle-answer-${value}`} key={value} selected={answers.missingAngle === value} label={`${value}°`} detail="Eksik açı" onClick={() => setAnswer('missingAngle', value)} tone="amber" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton variant="tension" testId="triangle-similarity-aaa" selected={answers.similarity === 'AAA'} label="AAA" detail="Açı-Açı-Açı" onClick={() => setAnswer('similarity', 'AAA')} tone="green" />
        <ChoiceButton variant="tension" testId="triangle-similarity-ssa" selected={answers.similarity === 'SSA'} label="SSA" detail="Belirsiz durum" onClick={() => setAnswer('similarity', 'SSA')} tone="pink" />
        <ChoiceButton variant="tension" testId="triangle-ratio-2" selected={answers.ratio === '2'} label="2" detail="6/3 = 8/4 = 10/5" onClick={() => setAnswer('ratio', '2')} tone="cyan" />
        <ChoiceButton variant="tension" testId="triangle-ratio-3" selected={answers.ratio === '3'} label="3" detail="Fazla büyütme" onClick={() => setAnswer('ratio', '3')} tone="pink" />
        <ChoiceButton variant="tension" testId="triangle-theorem-euclid" selected={answers.theorem === 'Euclid'} label="Öklid" detail="h²=p·k" onClick={() => setAnswer('theorem', 'Euclid')} tone="purple" />
        <ChoiceButton variant="tension" testId="triangle-theorem-tales" selected={answers.theorem === 'Tales'} label="Tales" detail="Paralel oran" onClick={() => setAnswer('theorem', 'Tales')} tone="amber" />
      </div>
    </div>
  );
}
