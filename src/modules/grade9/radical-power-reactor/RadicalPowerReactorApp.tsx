import React, { useState } from 'react';
import { Check, RotateCcw, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'radical-power-reactor';

const ATOM_IDS = [
  'MAT.9.1.1.1',
  'MAT.9.1.1.2',
  'MAT.9.1.2.1',
  'MAT.9.1.2.2',
  'MAT.9.1.3.1',
  'MAT.9.1.3.2',
  'MAT.9.1.3.3',
  'MAT.9.1.3.4',
  'MAT.9.1.4.1',
  'MAT.9.1.4.2',
  'MAT.9.1.5.1',
  'MAT.9.1.5.2',
];

const MISSIONS: MissionStep[] = [
  { id: 'power-core', title: 'Üs Çekirdeklerini Birleştir', atomId: 'MAT.9.1.1.2', prompt: '2^3 ve 2^2 çekirdeklerini aynı tabanda çarpıştır. Merkezde üslerin toplamı oluşmalı.' },
  { id: 'root-extractor', title: 'Kökten Tam Kareyi Çıkar', atomId: 'MAT.9.1.2.2', prompt: '√72 içindeki 36 tam kare bloğunu dışarı al. Geriye √2 kalmalı.' },
  { id: 'interval-gates', title: 'Aralık Kapılarını Ayarla', atomId: 'MAT.9.1.3.3', prompt: '[-2,4] ile (1,7] kesişiminde sol uç açık, sağ uç kapalı kalmalı.' },
  { id: 'set-drop', title: '√2 Parçacığını Yerleştir', atomId: 'MAT.9.1.4.2', prompt: '√2 rasyonel bölgeye sığmaz; gerçek sayı şemsiyesinde irrasyonel alana düşür.' },
  { id: 'distribute-beam', title: 'Dağıtma Işınını Aç', atomId: 'MAT.9.1.5.2', prompt: '3 çarpanını x ve 2 hücrelerine aynı anda gönder. Sonuç 3x + 6 olmalı.' },
];

type ReactorState = {
  powerCharge: number;
  rootExtract: number;
  intervalAligned: boolean;
  setPosition: number;
  lawSpread: number;
};

const initialState: ReactorState = {
  powerCharge: 0,
  rootExtract: 0,
  intervalAligned: false,
  setPosition: 0,
  lawSpread: 0,
};

export default function RadicalPowerReactorApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [state, setState] = useState<ReactorState>(initialState);
  const activeIndex = progress.activeIndex;

  const patchState = (patch: Partial<ReactorState>) => setState((current) => ({ ...current, ...patch }));
  const resetPanel = () => setState(initialState);
  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const checks = [
    state.powerCharge >= 95,
    state.rootExtract >= 95,
    state.intervalAligned,
    state.setPosition === 2,
    state.lawSpread >= 95,
  ];

  const handleCheck = () => {
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Reaktör sezgisi doğru çalıştı. Bir sonraki katman açılıyor.',
      error: 'Reaktör henüz hedef düzenine ulaşmadı. Sahnedeki ana kontrolü hedefe kadar sürükle.',
    });
  };

  return (
    <Grade9LabShell
      title="Kök ve Üs Reaktörü"
      subtitle="MAT.9.1.1.x - MAT.9.1.5.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#060b05] [background-image:radial-gradient(circle_at_22%_20%,rgba(0,255,136,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,#060b05_0%,#07140c_58%,#030603_100%)]"
      badges={[
        { label: 'Katman', value: `${activeIndex + 1}/${MISSIONS.length}`, tone: 'green' },
        { label: 'Deney', value: 'tek reaktör', tone: 'amber' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ReactorScene activeIndex={activeIndex} state={state} />
        <ReactorControls
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

function ReactorScene({ activeIndex, state }: { activeIndex: number; state: ReactorState }) {
  const merge = state.powerCharge / 100;
  const root = state.rootExtract / 100;
  const law = state.lawSpread / 100;
  const particleX = 285 + state.setPosition * 88;
  const resultLabel = ['2^(3+2)', '6√2', '(1,4]', '√2 ∈ R\\Q', '3x+6'][activeIndex];

  return (
    <section data-testid="radical-scene" className="relative overflow-hidden rounded-[34px_14px_34px_14px] border border-emerald-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(0,255,136,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,229,255,0.14),transparent_50%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/55">tek ana deney</p>
          <h2 className="text-2xl font-black text-white">Sayı Reaktörünü Elle Kalibre Et</h2>
        </div>
        <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 font-mono text-sm font-black text-emerald-100">
          {resultLabel}
        </div>
      </div>

      <div className="relative min-h-[500px] rounded-[28px_10px_28px_10px] border border-white/10 bg-[#020504]/70">
        <svg viewBox="0 0 760 500" className="h-full min-h-[500px] w-full">
          <defs>
            <filter id="reactor-glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="380" cy="250" r="150" fill="rgba(0,229,255,0.06)" stroke="rgba(0,229,255,0.22)" strokeWidth="3" />
          <circle cx="380" cy="250" r="88" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.28)" strokeWidth="3" />

          {activeIndex === 0 ? (
            <>
              <motion.circle cx={170 + merge * 150} cy="250" r="54" fill="rgba(0,255,136,0.16)" stroke="#00FF88" strokeWidth="4" filter="url(#reactor-glow)" />
              <motion.circle cx={590 - merge * 150} cy="250" r="54" fill="rgba(251,191,36,0.16)" stroke="#FBBF24" strokeWidth="4" filter="url(#reactor-glow)" />
              <text x={170 + merge * 150} y="258" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900">2³</text>
              <text x={590 - merge * 150} y="258" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900">2²</text>
              <text x="380" y="258" textAnchor="middle" fill="#00E5FF" fontSize="34" fontWeight="900">{merge > 0.9 ? '2⁵' : '3 + 2'}</text>
              <text x="380" y="430" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="18" fontWeight="900">Aynı taban: üsler toplanır</text>
            </>
          ) : null}

          {activeIndex === 1 ? (
            <>
              <rect x="120" y="180" width="180" height="120" rx="24" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="4" />
              <text x="210" y="252" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">√72</text>
              <motion.rect x={330 + root * 120} y={180 - root * 44} width="110" height="84" rx="20" fill="rgba(0,255,136,0.15)" stroke="#00FF88" strokeWidth="4" filter="url(#reactor-glow)" />
              <motion.rect x={330 + root * 120} y={280 + root * 36} width="110" height="64" rx="18" fill="rgba(179,136,255,0.13)" stroke="#B388FF" strokeWidth="4" />
              <text x={385 + root * 120} y={230 - root * 44} textAnchor="middle" fill="#00FF88" fontSize="24" fontWeight="900">√36</text>
              <text x={385 + root * 120} y={320 + root * 36} textAnchor="middle" fill="#B388FF" fontSize="24" fontWeight="900">√2</text>
              <text x="610" y="258" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="900">{root > 0.9 ? '6√2' : 'ayrıştır'}</text>
            </>
          ) : null}

          {activeIndex === 2 ? (
            <>
              <line x1="100" y1="250" x2="660" y2="250" stroke="rgba(255,255,255,0.42)" strokeWidth="5" strokeLinecap="round" />
              {[100, 250, 430, 610].map((x, index) => {
                const labels = ['-2', '1', '4', '7'];
                const isOpen = index === 1 && state.intervalAligned;
                const isClosed = index === 2 && state.intervalAligned;
                return (
                  <g key={labels[index]}>
                    <line x1={x} y1="222" x2={x} y2="278" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
                    <circle cx={x} cy="250" r="17" fill={isClosed ? '#00FF88' : '#020504'} stroke={isOpen || isClosed ? '#FBBF24' : 'rgba(255,255,255,0.35)'} strokeWidth="5" />
                    <text x={x} y="310" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">{labels[index]}</text>
                  </g>
                );
              })}
              <motion.rect x="250" y="236" width="180" height="28" rx="14" fill="rgba(0,229,255,0.28)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <text x="340" y="210" textAnchor="middle" fill="#00E5FF" fontSize="24" fontWeight="900">(1,4]</text>
            </>
          ) : null}

          {activeIndex === 3 ? (
            <>
              {[
                { x: 285, r: 58, label: 'Z', color: '#FBBF24' },
                { x: 373, r: 74, label: 'Q', color: '#00FF88' },
                { x: 461, r: 94, label: 'R\\Q', color: '#B388FF' },
              ].map((zone) => (
                <g key={zone.label}>
                  <circle cx={zone.x} cy="250" r={zone.r} fill="none" stroke={zone.color} strokeWidth="4" opacity="0.55" />
                  <text x={zone.x} y="382" textAnchor="middle" fill={zone.color} fontSize="18" fontWeight="900">{zone.label}</text>
                </g>
              ))}
              <motion.circle cx={particleX} cy="250" r="26" fill="rgba(179,136,255,0.25)" stroke="#B388FF" strokeWidth="4" filter="url(#reactor-glow)" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <text x={particleX} y="258" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">√2</text>
            </>
          ) : null}

          {activeIndex === 4 ? (
            <>
              <circle cx="170" cy="250" r="50" fill="rgba(251,191,36,0.16)" stroke="#FBBF24" strokeWidth="4" />
              <text x="170" y="260" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900">3</text>
              <rect x="410" y="150" width="110" height="82" rx="20" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="4" />
              <rect x="410" y="285" width="110" height="82" rx="20" fill="rgba(0,255,136,0.12)" stroke="#00FF88" strokeWidth="4" />
              <motion.path d="M220 230 C300 160 340 156 410 190" fill="none" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" strokeDasharray="10 10" pathLength={law} />
              <motion.path d="M220 270 C300 346 340 346 410 326" fill="none" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" strokeDasharray="10 10" pathLength={law} />
              <text x="465" y="200" textAnchor="middle" fill="#fff" fontSize="27" fontWeight="900">x</text>
              <text x="465" y="336" textAnchor="middle" fill="#fff" fontSize="27" fontWeight="900">2</text>
              <text x="620" y="260" textAnchor="middle" fill="#00E5FF" fontSize="32" fontWeight="900">{law > 0.9 ? '3x + 6' : '3(x+2)'}</text>
            </>
          ) : null}
        </svg>
      </div>
    </section>
  );
}

interface ReactorControlsProps {
  mission: MissionStep;
  activeIndex: number;
  state: ReactorState;
  setState: (patch: Partial<ReactorState>) => void;
  onCheck: () => void;
  onReset: () => void;
}

function ReactorControls({ mission, activeIndex, state, setState, onCheck, onReset }: ReactorControlsProps) {
  return (
    <aside className="rounded-[30px_12px_30px_12px] border border-emerald-300/18 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/55">reaktör görevi {activeIndex + 1}/5</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-emerald-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        {activeIndex === 0 ? (
          <ExperimentSlider testId="radical-power-slider" label="çekirdekleri yaklaştır" value={state.powerCharge} onChange={(value) => setState({ powerCharge: value })} />
        ) : null}
        {activeIndex === 1 ? (
          <ExperimentSlider testId="radical-root-slider" label="tam kareyi dışarı çek" value={state.rootExtract} onChange={(value) => setState({ rootExtract: value })} />
        ) : null}
        {activeIndex === 2 ? (
          <button
            data-testid="radical-interval-gates"
            onClick={() => setState({ intervalAligned: true })}
            className={`min-h-[72px] w-full rounded-2xl border px-4 text-left font-black transition ${state.intervalAligned ? 'border-[#00FF88]/40 bg-[#00FF88]/12 text-[#00FF88]' : 'border-white/10 bg-white/5 text-white hover:border-[#00E5FF]/40'}`}
          >
            Kapıları (1,4] kesişimine kilitle
          </button>
        ) : null}
        {activeIndex === 3 ? (
          <div>
            <ExperimentSlider testId="radical-set-slider" label="√2 parçacığını sağa sürükle" min={0} max={2} value={state.setPosition} onChange={(value) => setState({ setPosition: value })} />
            <div className="mt-2 grid grid-cols-3 text-center font-mono text-[10px] uppercase tracking-wider text-white/45">
              <span>Z</span><span>Q</span><span>R\Q</span>
            </div>
          </div>
        ) : null}
        {activeIndex === 4 ? (
          <ExperimentSlider testId="radical-law-slider" label="dağıtma ışınını aç" value={state.lawSpread} onChange={(value) => setState({ lawSpread: value })} />
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="radical-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Deneyi Onayla
        </SciFiButton>
        <SciFiButton data-testid="radical-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-xs leading-relaxed text-amber-50/70">
        <Zap className="mb-2 h-4 w-4 text-amber-200" />
        Bu modülde cevap seçmiyorsun; matematiksel parçayı doğru konuma getiriyorsun.
      </div>
    </aside>
  );
}

interface ExperimentSliderProps {
  testId: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function ExperimentSlider({ testId, label, value, onChange, min = 0, max = 100 }: ExperimentSliderProps) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-white/60">{label}</span>
      <input
        data-testid={testId}
        type="range"
        min={min}
        max={max}
        step={max === 2 ? 1 : 1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 w-full accent-[#00FF88]"
      />
      <button
        type="button"
        data-testid={`${testId}-complete`}
        onClick={() => onChange(max)}
        className="mt-3 min-h-[44px] w-full rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-sm font-black uppercase tracking-wider text-emerald-100 hover:border-emerald-300/45"
      >
        Hedefe Sürükle
      </button>
    </label>
  );
}
