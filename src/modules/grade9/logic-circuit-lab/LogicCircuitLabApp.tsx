import React, { useMemo, useState } from 'react';
import { Binary, Check, GitBranch, Lightbulb, Play, RotateCcw, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'logic-circuit-lab';

const ATOM_IDS = [
  'MAT.9.3.1.1',
  'MAT.9.3.2.1',
  'MAT.9.3.2.2',
  'MAT.9.3.2.3',
  'MAT.9.3.2.4',
  'MAT.9.3.3.1',
  'MAT.9.3.3.2',
];

const MISSIONS: MissionStep[] = [
  {
    id: 'flow-order',
    title: 'Akış Şeması',
    atomId: 'MAT.9.3.1.1',
    prompt: 'Problemi makine adımlarına böl. Doğru sıra: oku, karşılaştır, kapıdan geçir, sonucu yaz.',
  },
  {
    id: 'and-gate',
    title: 'VE Kapısı',
    atomId: 'MAT.9.3.2.1',
    prompt: 'VE kapısı yalnızca iki giriş de 1 ise ışık verir. A=1 ve B=1 akımını kur.',
  },
  {
    id: 'implies-gate',
    title: 'İSE 100 Kuralı',
    atomId: 'MAT.9.3.2.3',
    prompt: 'İSE kapısında tek çöküş A=1, B=0 durumudur. Bu patlama senaryosunu doğrula.',
  },
  {
    id: 'xor-gate',
    title: 'YA DA Kapısı',
    atomId: 'MAT.9.3.2.4',
    prompt: 'YA DA kapısı iki sinyal farklı olduğunda yanar. Girişlerden yalnızca birini 1 yap.',
  },
  {
    id: 'quantifier-radar',
    title: 'Niceleyici Radarı',
    atomId: 'MAT.9.3.3.2',
    prompt: 'Radar kümesinde en az bir aktif eleman var. Bu cümle için varlıksal niceleyiciyi seç.',
  },
];

type Gate = 'and' | 'or' | 'implies' | 'xor';
type Quantifier = 'forall' | 'exists';
type FlowStep = 'Oku' | 'Karşılaştır' | 'Kapıdan geçir' | 'Sonucu yaz';

const FLOW_STEPS: FlowStep[] = ['Oku', 'Karşılaştır', 'Kapıdan geçir', 'Sonucu yaz'];

const evaluateGate = (gate: Gate, a: boolean, b: boolean): boolean => {
  if (gate === 'and') return a && b;
  if (gate === 'or') return a || b;
  if (gate === 'xor') return a !== b;
  return !(a && !b);
};

export default function LogicCircuitLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [gate, setGate] = useState<Gate>('and');
  const [quantifier, setQuantifier] = useState<Quantifier>('forall');
  const [flowOrder, setFlowOrder] = useState<FlowStep[]>([]);

  const output = useMemo(() => evaluateGate(gate, inputA, inputB), [gate, inputA, inputB]);

  const resetPanel = () => {
    setInputA(false);
    setInputB(false);
    setGate('and');
    setQuantifier('forall');
    setFlowOrder([]);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const toggleFlow = (step: FlowStep) => {
    setFlowOrder((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step]);
  };

  const handleCheck = () => {
    const flowOk = flowOrder.join('|') === FLOW_STEPS.join('|');
    const checks = [
      flowOk,
      gate === 'and' && inputA && inputB && output,
      gate === 'implies' && inputA && !inputB && !output,
      gate === 'xor' && inputA !== inputB && output,
      quantifier === 'exists',
    ];

    progress.submitMission({
      ok: checks[progress.activeIndex] ?? false,
      success: 'Devre doğru akımı verdi. Bir sonraki mantık kilidi açıldı.',
      error: 'Devre hedef cümleyi üretmedi. Girişleri, kapıyı veya niceleyiciyi tekrar ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Akıllı Mantık Devreleri"
      subtitle="MAT.9.3.1.x / MAT.9.3.2.x / MAT.9.3.3.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      badges={[
        { label: 'A/B', value: `${Number(inputA)}-${Number(inputB)}`, tone: 'cyan' },
        { label: 'Çıkış', value: output ? '1' : '0', tone: output ? 'green' : 'pink' },
      ]}
    >
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#07101e]/80 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill label="Kapı" value={gate.toUpperCase()} tone="purple" />
            <MetricPill label="A" value={inputA ? '1' : '0'} tone={inputA ? 'green' : 'pink'} />
            <MetricPill label="B" value={inputB ? '1' : '0'} tone={inputB ? 'green' : 'pink'} />
            <MetricPill label="Niceleyici" value={quantifier === 'forall' ? 'HER' : 'BAZI'} tone="amber" />
          </div>
          <CircuitVisual inputA={inputA} inputB={inputB} gate={gate} output={output} quantifier={quantifier} flowOrder={flowOrder} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <Workflow className="h-4 w-4 text-[#00E5FF]" /> Akış Sırası
            </h4>
            <div className="grid gap-2">
              {FLOW_STEPS.map((step) => (
                <ChoiceButton
                  key={step}
                  testId={`logic-flow-${step.toLowerCase().replaceAll(' ', '-')}`}
                  selected={flowOrder.includes(step)}
                  label={`${flowOrder.includes(step) ? flowOrder.indexOf(step) + 1 : '-'}  ${step}`}
                  detail="Sıralamak için sırayla tıkla"
                  onClick={() => toggleFlow(step)}
                  tone="cyan"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ToggleNode testId="logic-input-a" label="A" value={inputA} onClick={() => setInputA((current) => !current)} />
            <ToggleNode testId="logic-input-b" label="B" value={inputB} onClick={() => setInputB((current) => !current)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['and', 'or', 'implies', 'xor'] as Gate[]).map((item) => (
              <ChoiceButton
                key={item}
                testId={`logic-gate-${item}`}
                selected={gate === item}
                label={gateLabel(item)}
                detail={gateDetail(item)}
                onClick={() => setGate(item)}
                tone={item === 'implies' ? 'amber' : 'purple'}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton testId="logic-quantifier-forall" selected={quantifier === 'forall'} label="∀ Her" detail="Tüm elemanlar doğru" onClick={() => setQuantifier('forall')} tone="green" />
            <ChoiceButton testId="logic-quantifier-exists" selected={quantifier === 'exists'} label="∃ Bazı" detail="En az bir eleman doğru" onClick={() => setQuantifier('exists')} tone="cyan" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="logic-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              Devreyi Test Et
            </SciFiButton>
            <SciFiButton data-testid="logic-reset" variant="secondary" onClick={resetPanel} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
    </Grade9LabShell>
  );
}

function gateLabel(gate: Gate): string {
  if (gate === 'and') return 'VE ∧';
  if (gate === 'or') return 'VEYA ∨';
  if (gate === 'xor') return 'YA DA ⊻';
  return 'İSE =>';
}

function gateDetail(gate: Gate): string {
  if (gate === 'and') return 'Sadece 1-1 yanar';
  if (gate === 'or') return 'Sadece 0-0 söner';
  if (gate === 'xor') return 'Farklıysa yanar';
  return '1=>0 söner';
}

interface ToggleNodeProps {
  label: string;
  value: boolean;
  onClick: () => void;
  testId: string;
}

function ToggleNode({ label, value, onClick, testId }: ToggleNodeProps) {
  return (
    <motion.button
      data-testid={testId}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`min-h-[64px] rounded-2xl border p-4 text-left ${value ? 'border-[#00FF88]/35 bg-[#00FF88]/10' : 'border-[#FF0055]/30 bg-[#FF0055]/10'}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Giriş {label}</p>
      <p className={`mt-1 font-mono text-3xl font-black ${value ? 'text-[#00FF88]' : 'text-[#FF6B9A]'}`}>{value ? '1' : '0'}</p>
    </motion.button>
  );
}

interface CircuitVisualProps {
  inputA: boolean;
  inputB: boolean;
  gate: Gate;
  output: boolean;
  quantifier: Quantifier;
  flowOrder: FlowStep[];
}

function CircuitVisual({ inputA, inputB, gate, output, quantifier, flowOrder }: CircuitVisualProps) {
  const signalColor = output ? '#00FF88' : '#FF0055';
  const setLights = [true, false, true, false, false];

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/45 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(179,136,255,0.15),transparent_48%)]" />
      <svg viewBox="0 0 640 360" className="relative h-[300px] w-full">
        <defs>
          <filter id="logic-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M90 110 H250" stroke={inputA ? '#00FF88' : '#FF0055'} strokeWidth="8" strokeLinecap="round" filter="url(#logic-glow)" />
        <path d="M90 230 H250" stroke={inputB ? '#00FF88' : '#FF0055'} strokeWidth="8" strokeLinecap="round" filter="url(#logic-glow)" />
        <path d="M390 170 H540" stroke={signalColor} strokeWidth="10" strokeLinecap="round" filter="url(#logic-glow)" />
        <circle cx="72" cy="110" r="32" fill={inputA ? 'rgba(0,255,136,0.16)' : 'rgba(255,0,85,0.16)'} stroke={inputA ? '#00FF88' : '#FF0055'} strokeWidth="3" />
        <circle cx="72" cy="230" r="32" fill={inputB ? 'rgba(0,255,136,0.16)' : 'rgba(255,0,85,0.16)'} stroke={inputB ? '#00FF88' : '#FF0055'} strokeWidth="3" />
        <text x="72" y="119" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900">{inputA ? '1' : '0'}</text>
        <text x="72" y="239" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900">{inputB ? '1' : '0'}</text>
        <motion.path
          d="M250 70 H335 C392 70 420 270 335 270 H250 Q290 170 250 70"
          fill="rgba(0,229,255,0.10)"
          stroke="#00E5FF"
          strokeWidth="3"
          animate={{ opacity: [0.68, 1, 0.68] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
        <text x="330" y="181" textAnchor="middle" fill="#00E5FF" fontSize="32" fontWeight="900">{gateLabel(gate)}</text>
        <circle cx="570" cy="170" r="40" fill={output ? 'rgba(0,255,136,0.2)' : 'rgba(255,0,85,0.18)'} stroke={signalColor} strokeWidth="4" filter="url(#logic-glow)" />
        <text x="570" y="181" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">{output ? '1' : '0'}</text>
      </svg>

      <div className="relative grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-black text-white">
            <GitBranch className="h-4 w-4 text-[#00E5FF]" /> Algoritma Sırası
          </div>
          <div className="flex flex-wrap gap-2">
            {flowOrder.length === 0 ? <span className="text-xs text-white/45">Henüz akış yok</span> : null}
            {flowOrder.map((step, index) => (
              <span key={`${step}-${index}`} className="rounded-full border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-3 py-1 text-xs font-black text-[#00E5FF]">
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
            <Binary className="h-4 w-4 text-[#B388FF]" /> Niceleyici Radarı
          </div>
          <div className="flex items-center gap-2">
            {setLights.map((lit, index) => (
              <span
                key={index}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-sm font-black ${
                  lit ? 'border-[#00FF88]/35 bg-[#00FF88]/10 text-[#00FF88]' : 'border-white/10 bg-black/25 text-white/35'
                }`}
              >
                {lit ? 1 : 0}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-2 text-xs font-black text-white">
              <Lightbulb className={`h-4 w-4 ${quantifier === 'exists' ? 'text-[#00FF88]' : 'text-white/35'}`} />
              {quantifier === 'exists' ? 'En az 1' : 'Hepsi'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
