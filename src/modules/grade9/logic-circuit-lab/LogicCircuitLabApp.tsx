import { useMemo, useState } from 'react';
import { Cable, Check, Power, Radar, RotateCcw, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
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
  { id: 'flow-order', title: 'Akış Şeması', atomId: 'MAT.9.3.1.1', prompt: 'Makineyi sırayla kur: oku, karşılaştır, kapıdan geçir, sonucu yaz. Hatlar sırayla yanmalı.' },
  { id: 'and-gate', title: 'VE Kapısı', atomId: 'MAT.9.3.2.1', prompt: 'VE kapısında çıkış yalnızca A=1 ve B=1 iken yanar. İki girişi de aktif et.' },
  { id: 'implies-gate', title: 'İSE Hata Durumu', atomId: 'MAT.9.3.2.3', prompt: 'İSE kapısının tek çöküşünü üret: A=1 ve B=0. Bu durumda çıkış söner.' },
  { id: 'xor-gate', title: 'YA DA Kapısı', atomId: 'MAT.9.3.2.4', prompt: 'YA DA kapısı iki sinyal farklıysa yanar. Girişlerden yalnızca biri aktif kalsın.' },
  { id: 'quantifier-radar', title: 'Niceleyici Radarı', atomId: 'MAT.9.3.3.2', prompt: 'Radar kümesinde en az bir aktif eleman var. Bu durum varlıksal niceleyicidir.' },
];

type Gate = 'and' | 'or' | 'implies' | 'xor';
type Quantifier = 'forall' | 'exists';

const FLOW_STEPS = ['Oku', 'Karşılaştır', 'Kapıdan geçir', 'Sonucu yaz'] as const;

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
  const [flowIndex, setFlowIndex] = useState(0);
  const activeIndex = progress.activeIndex;
  const output = useMemo(() => evaluateGate(gate, inputA, inputB), [gate, inputA, inputB]);

  const resetPanel = () => {
    setInputA(false);
    setInputB(false);
    setGate('and');
    setQuantifier('forall');
    setFlowIndex(0);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const checks = [
    flowIndex >= FLOW_STEPS.length,
    gate === 'and' && inputA && inputB && output,
    gate === 'implies' && inputA && !inputB && !output,
    gate === 'xor' && inputA !== inputB && output,
    quantifier === 'exists',
  ];

  const handleCheck = () => {
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Devre beklenen sinyali üretti. Bir sonraki mantık katmanı açılıyor.',
      error: 'Devre hedef cümleyi üretmedi. Aktif girişleri, kapıyı veya radarı tekrar ayarla.',
    });
  };

  return (
    <Grade9LabShell
      title="Akıllı Mantık Devreleri"
      subtitle="MAT.9.3.1.x / MAT.9.3.2.x / MAT.9.3.3.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#03080f] [background-image:radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(59,130,246,0.13),transparent_26%),linear-gradient(180deg,#03080f_0%,#07121f_58%,#03060b_100%)]"
      badges={[
        { label: 'A/B', value: `${Number(inputA)}-${Number(inputB)}`, tone: 'cyan' },
        { label: 'Çıkış', value: output ? '1' : '0', tone: output ? 'green' : 'pink' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <CircuitScene activeIndex={activeIndex} inputA={inputA} inputB={inputB} gate={gate} output={output} flowIndex={flowIndex} quantifier={quantifier} />
        <CircuitControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          inputA={inputA}
          inputB={inputB}
          gate={gate}
          quantifier={quantifier}
          flowIndex={flowIndex}
          setInputA={setInputA}
          setInputB={setInputB}
          setGate={setGate}
          setQuantifier={setQuantifier}
          setFlowIndex={setFlowIndex}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

interface CircuitSceneProps {
  activeIndex: number;
  inputA: boolean;
  inputB: boolean;
  gate: Gate;
  output: boolean;
  flowIndex: number;
  quantifier: Quantifier;
}

function CircuitScene({ activeIndex, inputA, inputB, gate, output, flowIndex, quantifier }: CircuitSceneProps) {
  const impliesFailure = activeIndex === 2 && gate === 'implies' && inputA && !inputB;
  return (
    <section data-testid="logic-scene" className="relative overflow-hidden rounded-lg border border-sky-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(56,189,248,0.10)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative mb-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">tek ana deney</p>
        <h2 className="text-2xl font-black text-white">Sinyali Devreden Geçir</h2>
      </div>

      <svg viewBox="0 0 720 500" className="relative h-[520px] w-full rounded-lg border border-white/10 bg-[#020611]/78">
        <defs>
          <filter id="circuit-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {activeIndex === 0 ? (
          <>
            {FLOW_STEPS.map((step, index) => {
              const x = 110 + index * 165;
              const active = flowIndex > index;
              return (
                <g key={step}>
                  {index < FLOW_STEPS.length - 1 ? <line x1={x + 48} y1="248" x2={x + 150} y2="248" stroke={flowIndex > index + 1 ? '#00FF88' : 'rgba(255,255,255,0.18)'} strokeWidth="7" strokeLinecap="round" /> : null}
                  <rect x={x - 48} y="202" width="96" height="92" rx="18" fill={active ? 'rgba(0,255,136,0.13)' : 'rgba(255,255,255,0.045)'} stroke={active ? '#00FF88' : 'rgba(255,255,255,0.18)'} strokeWidth="4" />
                  <text x={x} y="254" textAnchor="middle" fill={active ? '#00FF88' : '#fff'} fontSize="15" fontWeight="900">{step}</text>
                </g>
              );
            })}
            <text x="360" y="430" textAnchor="middle" fill="#38BDF8" fontSize="20" fontWeight="900">Algoritma, doğru sırada yanan adımlardır</text>
          </>
        ) : null}

        {activeIndex > 0 && activeIndex < 4 ? (
          <>
            <WireNode x={130} y={160} label="A" on={inputA} />
            <WireNode x={130} y={340} label="B" on={inputB} />
            <line x1="178" y1="160" x2="315" y2="235" stroke={inputA ? '#00FF88' : 'rgba(255,255,255,0.16)'} strokeWidth="8" strokeLinecap="round" />
            <line x1="178" y1="340" x2="315" y2="265" stroke={inputB ? '#00FF88' : 'rgba(255,255,255,0.16)'} strokeWidth="8" strokeLinecap="round" />
            <rect x="315" y="185" width="160" height="130" rx="26" fill={impliesFailure ? 'rgba(255,0,85,0.18)' : 'rgba(56,189,248,0.11)'} stroke={impliesFailure ? '#FF0055' : '#38BDF8'} strokeWidth="5" filter={impliesFailure ? 'url(#circuit-glow)' : undefined} />
            <text x="395" y="258" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">{gateLabel(gate)}</text>
            <line x1="475" y1="250" x2="590" y2="250" stroke={output ? '#00FF88' : impliesFailure ? '#FF0055' : 'rgba(255,255,255,0.16)'} strokeWidth="8" strokeLinecap="round" />
            <circle cx="625" cy="250" r="42" fill={output ? 'rgba(0,255,136,0.16)' : 'rgba(255,0,85,0.12)'} stroke={output ? '#00FF88' : '#FF0055'} strokeWidth="5" />
            <text x="625" y="263" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">{output ? '1' : '0'}</text>
            {impliesFailure ? (
              <>
                <motion.circle cx="395" cy="250" r="70" fill="none" stroke="#FF0055" strokeWidth="5" animate={{ r: [55, 95, 55], opacity: [0.9, 0.15, 0.9] }} transition={{ duration: 1, repeat: Infinity }} />
                <text x="395" y="365" textAnchor="middle" fill="#FF6B9A" fontSize="20" fontWeight="900">1 =&gt; 0 İSE kapısını söndürür</text>
              </>
            ) : null}
          </>
        ) : null}

        {activeIndex === 4 ? (
          <>
            {[0, 1, 2, 3, 4, 5].map((item) => {
              const angle = (item / 6) * Math.PI * 2;
              const active = item === 2;
              return (
                <g key={item}>
                  <line x1="360" y1="250" x2={360 + Math.cos(angle) * 148} y2={250 + Math.sin(angle) * 148} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <circle cx={360 + Math.cos(angle) * 148} cy={250 + Math.sin(angle) * 148} r="24" fill={active ? '#00FF88' : 'rgba(255,255,255,0.08)'} stroke={active ? '#00FF88' : 'rgba(255,255,255,0.24)'} strokeWidth="4" />
                </g>
              );
            })}
            <circle cx="360" cy="250" r="95" fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.34)" strokeWidth="4" />
            <text x="360" y="258" textAnchor="middle" fill={quantifier === 'exists' ? '#00FF88' : '#FBBF24'} fontSize="38" fontWeight="900">{quantifier === 'exists' ? '∃' : '∀'}</text>
            <text x="360" y="430" textAnchor="middle" fill="#38BDF8" fontSize="20" fontWeight="900">En az bir ışık yanıyorsa ∃ doğru okur</text>
          </>
        ) : null}
      </svg>
    </section>
  );
}

function WireNode({ x, y, label, on }: { x: number; y: number; label: string; on: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="42" fill={on ? 'rgba(0,255,136,0.16)' : 'rgba(255,0,85,0.12)'} stroke={on ? '#00FF88' : '#FF0055'} strokeWidth="5" />
      <text x={x} y={y - 4} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">{label}</text>
      <text x={x} y={y + 22} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900">{on ? '1' : '0'}</text>
    </g>
  );
}

interface CircuitControlsProps {
  mission: MissionStep;
  activeIndex: number;
  inputA: boolean;
  inputB: boolean;
  gate: Gate;
  quantifier: Quantifier;
  flowIndex: number;
  setInputA: (value: boolean) => void;
  setInputB: (value: boolean) => void;
  setGate: (value: Gate) => void;
  setQuantifier: (value: Quantifier) => void;
  setFlowIndex: (value: number) => void;
  onCheck: () => void;
  onReset: () => void;
}

function CircuitControls(props: CircuitControlsProps) {
  const { mission, activeIndex, inputA, inputB, gate, quantifier, flowIndex, setInputA, setInputB, setGate, setQuantifier, setFlowIndex, onCheck, onReset } = props;

  return (
    <aside className="rounded-lg border border-dashed border-sky-300/22 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">devre görevi {activeIndex + 1}/5</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sky-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-lg border border-dashed border-white/12 bg-white/[0.045] p-4">
        {activeIndex === 0 ? (
          <div className="space-y-3">
            {FLOW_STEPS.map((step, index) => (
              <button
                key={step}
                data-testid={`logic-flow-${index + 1}`}
                onClick={() => setFlowIndex(index === flowIndex ? flowIndex + 1 : flowIndex)}
                className={`min-h-[52px] w-full rounded-lg border px-4 text-left font-black transition ${flowIndex > index ? 'border-[#00FF88]/40 bg-[#00FF88]/12 text-[#00FF88]' : 'border-white/10 bg-white/5 text-white/75 hover:border-sky-300/40'}`}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>
        ) : null}

        {activeIndex > 0 && activeIndex < 4 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ToggleNode testId="logic-input-a" label="A" value={inputA} onClick={() => setInputA(!inputA)} />
              <ToggleNode testId="logic-input-b" label="B" value={inputB} onClick={() => setInputB(!inputB)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['and', 'or', 'implies', 'xor'] as Gate[]).map((item) => (
                <button
                  key={item}
                  data-testid={`logic-gate-${item}`}
                  onClick={() => setGate(item)}
                  className={`min-h-[52px] rounded-lg border font-black transition ${gate === item ? 'border-sky-300/45 bg-sky-300/12 text-sky-100' : 'border-white/10 bg-white/5 text-white/70 hover:border-sky-300/35'}`}
                >
                  {gateLabel(item)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activeIndex === 4 ? (
          <div className="grid gap-3">
            <button data-testid="logic-quantifier-forall" onClick={() => setQuantifier('forall')} className={`min-h-[58px] rounded-lg border px-4 text-left font-black ${quantifier === 'forall' ? 'border-amber-300/45 bg-amber-300/12 text-amber-100' : 'border-white/10 bg-white/5 text-white/70'}`}>∀ Her eleman yanmalı</button>
            <button data-testid="logic-quantifier-exists" onClick={() => setQuantifier('exists')} className={`min-h-[58px] rounded-lg border px-4 text-left font-black ${quantifier === 'exists' ? 'border-[#00FF88]/45 bg-[#00FF88]/12 text-[#00FF88]' : 'border-white/10 bg-white/5 text-white/70'}`}>∃ En az biri yeter</button>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="logic-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Devreyi Test Et
        </SciFiButton>
        <SciFiButton data-testid="logic-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-xs leading-relaxed text-cyan-50/70">
        {activeIndex === 4 ? <Radar className="mb-2 h-4 w-4 text-cyan-200" /> : activeIndex === 0 ? <Workflow className="mb-2 h-4 w-4 text-cyan-200" /> : <Cable className="mb-2 h-4 w-4 text-cyan-200" />}
        Mantık kapısı bir cevap kartı değil; girişlerin akımı nasıl değiştirdiğini gösteren bir devredir.
      </div>
    </aside>
  );
}

function ToggleNode({ testId, label, value, onClick }: { testId: string; label: string; value: boolean; onClick: () => void }) {
  return (
    <motion.button
      data-testid={testId}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`min-h-[68px] rounded-lg border p-4 text-left ${value ? 'border-[#00FF88]/40 bg-[#00FF88]/12 text-[#00FF88]' : 'border-[#FF0055]/35 bg-[#FF0055]/10 text-[#FF6B9A]'}`}
    >
      <Power className="mb-1 h-4 w-4" />
      <p className="font-mono text-3xl font-black">{label}={value ? '1' : '0'}</p>
    </motion.button>
  );
}

function gateLabel(gate: Gate): string {
  if (gate === 'and') return 'VE ∧';
  if (gate === 'or') return 'VEYA ∨';
  if (gate === 'xor') return 'YA DA ⊻';
  return 'İSE =>';
}
