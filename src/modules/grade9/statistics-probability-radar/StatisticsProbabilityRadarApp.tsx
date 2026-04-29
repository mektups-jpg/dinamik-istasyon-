import React, { useMemo, useState } from 'react';
import { BarChart3, Check, Play, Radar, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';

const MODULE_ID = 'statistics-probability-radar';

const ATOM_IDS = ['MAT.9.6.1.1', 'MAT.9.6.1.2', 'MAT.9.6.2.1', 'MAT.9.7.1.1', 'MAT.9.7.2.1'];

const MISSIONS: MissionStep[] = [
  { id: 'stable-cloud', title: 'Dağılım Bulutunu Sıkıştır', atomId: 'MAT.9.6.2.1', prompt: 'Üç sınıf bulutunu karşılaştır. En dar ve en istikrarlı veri bulutu B sınıfıdır.' },
  { id: 'boxplot-reader', title: 'Medyan Tarayıcısını Ortaya Getir', atomId: 'MAT.9.6.1.2', prompt: 'Kutu-bıyık okuyucuda veriyi iki eş yarıya bölen çizgiyi medyana kilitle.' },
  { id: 'probability-machine', title: 'Deney Makinesini Çalıştır', atomId: 'MAT.9.7.1.1', prompt: 'Çarkı en az 30 kez çevir. Gözlenen başarı oranı yaklaşık 0.40 olmalı.' },
  { id: 'induction-projector', title: 'Oranı 1000 Atışa Yansıt', atomId: 'MAT.9.7.2.1', prompt: '0.40 oranını büyük evrene büyüt. 1000 denemede yaklaşık 400 başarı beklenir.' },
];

type GroupChoice = 'A' | 'B' | 'C';

const groups: Record<GroupChoice, number[]> = {
  A: [42, 60, 72, 88, 96],
  B: [67, 70, 72, 73, 76],
  C: [35, 54, 78, 92, 99],
};

const trialPattern = [true, false, false, true, false, true, false, false, true, false];

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const deviation = (values: number[]) => {
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length);
};

export default function StatisticsProbabilityRadarApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [groupChoice, setGroupChoice] = useState<GroupChoice>('A');
  const [compression, setCompression] = useState(0);
  const [medianScanner, setMedianScanner] = useState(42);
  const [trials, setTrials] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [projection, setProjection] = useState(250);

  const deviations = useMemo(() => ({
    A: deviation(groups.A),
    B: deviation(groups.B),
    C: deviation(groups.C),
  }), []);

  const observedProbability = trials === 0 ? 0 : successes / trials;
  const activeIndex = progress.activeIndex;

  const resetPanel = () => {
    setGroupChoice('A');
    setCompression(0);
    setMedianScanner(42);
    setTrials(0);
    setSuccesses(0);
    setProjection(250);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const runTrials = () => {
    let batchSuccess = 0;
    for (let i = 0; i < 10; i += 1) {
      if (trialPattern[(trials + i) % trialPattern.length]) batchSuccess += 1;
    }
    setTrials((current) => current + 10);
    setSuccesses((current) => current + batchSuccess);
  };

  const handleCheck = () => {
    const checks = [
      groupChoice === 'B' && compression >= 95,
      Math.abs(medianScanner - 70) <= 1,
      trials >= 30 && Math.abs(observedProbability - 0.4) < 0.01,
      trials >= 30 && projection === 400,
    ];
    progress.submitMission({
      ok: checks[activeIndex] ?? false,
      success: 'Veri laboratuvarı doğru okundu. Bir sonraki analiz katmanı açılıyor.',
      error: 'Radar hedefe ulaşmadı. Aktif sahnedeki ana kontrolü matematiksel hedefe getir.',
    });
  };

  return (
    <Grade9LabShell
      title="Veri ve Olasılık Radarı"
      subtitle="MAT.9.6.x / MAT.9.7.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-6xl px-4 py-5 sm:px-6 lg:px-8"
      frameClassName="bg-[#061006] [background-image:radial-gradient(circle_at_18%_18%,rgba(190,242,100,0.16),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(0,229,255,0.10),transparent_26%),linear-gradient(180deg,#061006_0%,#07150d_55%,#030803_100%)]"
      badges={[
        { label: 'Deney', value: `${trials} atış`, tone: 'cyan' },
        { label: 'Oran', value: observedProbability.toFixed(2), tone: 'green' },
      ]}
    >
      <div className="grid min-h-[640px] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <RadarScene
          activeIndex={activeIndex}
          groupChoice={groupChoice}
          compression={compression}
          medianScanner={medianScanner}
          trials={trials}
          successes={successes}
          projection={projection}
        />
        <RadarControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          groupChoice={groupChoice}
          compression={compression}
          medianScanner={medianScanner}
          trials={trials}
          observedProbability={observedProbability}
          projection={projection}
          deviations={deviations}
          setGroupChoice={setGroupChoice}
          setCompression={setCompression}
          setMedianScanner={setMedianScanner}
          runTrials={runTrials}
          setProjection={setProjection}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}

interface RadarSceneProps {
  activeIndex: number;
  groupChoice: GroupChoice;
  compression: number;
  medianScanner: number;
  trials: number;
  successes: number;
  projection: number;
}

function RadarScene({ activeIndex, groupChoice, compression, medianScanner, trials, successes, projection }: RadarSceneProps) {
  const observed = trials === 0 ? 0 : successes / trials;
  const selectedValues = groups[groupChoice];
  const spreadScale = groupChoice === 'B' ? 1 - compression / 150 : 1;
  const box = { min: 42, q1: 55, median: 70, q3: 82, max: 96 };
  const boxScale = (value: number) => 160 + ((value - box.min) / (box.max - box.min)) * 360;
  const scannerX = boxScale(medianScanner);
  const projectedFill = projection / 1000;

  return (
    <section data-testid="stats-scene" className="relative overflow-hidden rounded-[34px] border border-lime-200/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(190,242,100,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_36%,rgba(0,229,255,0.12),transparent_52%)]" />
      <div className="relative mb-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-lime-100/55">tek ana deney</p>
        <h2 className="text-2xl font-black text-white">Veriyi Hareket Ettir, Kuralı Gör</h2>
      </div>
      <svg viewBox="0 0 720 500" className="relative h-[520px] w-full rounded-[28px] border border-white/10 bg-[#020602]/70">
        <defs>
          <filter id="radar-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {activeIndex === 0 ? (
          <>
            {[70, 115, 160].map((r) => <circle key={r} cx="360" cy="240" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />)}
            {selectedValues.map((value, index) => {
              const angle = (index / selectedValues.length) * Math.PI * 2 - Math.PI / 2;
              const radius = (34 + value * 1.25) * spreadScale;
              return (
                <motion.circle
                  key={`${groupChoice}-${value}`}
                  cx={360 + Math.cos(angle) * radius}
                  cy={240 + Math.sin(angle) * radius}
                  r="13"
                  fill={groupChoice === 'B' ? '#00FF88' : '#B388FF'}
                  filter="url(#radar-glow)"
                  animate={{ scale: [1, 1.16, 1] }}
                  transition={{ delay: index * 0.08, duration: 1.2, repeat: Infinity }}
                />
              );
            })}
            <text x="360" y="248" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900">Sınıf {groupChoice}</text>
            <text x="360" y="432" textAnchor="middle" fill="#BEF264" fontSize="18" fontWeight="900">Bulut daraldıkça standart sapma küçülür</text>
          </>
        ) : null}

        {activeIndex === 1 ? (
          <>
            <rect x="110" y="120" width="500" height="250" rx="30" fill="rgba(0,229,255,0.055)" stroke="rgba(0,229,255,0.22)" strokeWidth="3" />
            <text x="360" y="158" textAnchor="middle" fill="#00E5FF" fontSize="18" fontWeight="900">KUTU-BIYIK OKUYUCU</text>
            <line x1={boxScale(box.min)} y1="260" x2={boxScale(box.max)} y2="260" stroke="rgba(255,255,255,0.54)" strokeWidth="5" strokeLinecap="round" />
            <line x1={boxScale(box.min)} y1="230" x2={boxScale(box.min)} y2="290" stroke="#FF6B9A" strokeWidth="5" />
            <line x1={boxScale(box.max)} y1="230" x2={boxScale(box.max)} y2="290" stroke="#FF6B9A" strokeWidth="5" />
            <rect x={boxScale(box.q1)} y="224" width={boxScale(box.q3) - boxScale(box.q1)} height="72" rx="16" fill="rgba(0,229,255,0.14)" stroke="#00E5FF" strokeWidth="4" />
            <line x1={boxScale(box.median)} y1="210" x2={boxScale(box.median)} y2="310" stroke="#00FF88" strokeWidth="7" strokeLinecap="round" />
            {[
              ['Min', box.min], ['Q1', box.q1], ['Medyan', box.median], ['Q3', box.q3], ['Max', box.max],
            ].map(([label, value]) => <text key={label} x={boxScale(Number(value))} y="335" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="13" fontWeight="900">{label}</text>)}
            <motion.line x1={scannerX} y1="178" x2={scannerX} y2="350" stroke="#FBBF24" strokeWidth="4" strokeDasharray="8 8" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.1, repeat: Infinity }} />
            <text x={scannerX} y="190" textAnchor="middle" fill="#FBBF24" fontSize="15" fontWeight="900">Tarayıcı</text>
          </>
        ) : null}

        {activeIndex === 2 ? (
          <>
            <circle cx="360" cy="235" r="118" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.35)" strokeWidth="4" />
            <motion.path d={`M360 235 L360 117 A118 118 0 ${observed > 0.5 ? 1 : 0} 1 ${360 + Math.sin(observed * Math.PI * 2) * 118} ${235 - Math.cos(observed * Math.PI * 2) * 118} Z`} fill="rgba(0,255,136,0.20)" animate={{ opacity: [0.55, 0.9, 0.55] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <text x="360" y="230" textAnchor="middle" fill="#00FF88" fontSize="42" fontWeight="900">{observed.toFixed(2)}</text>
            <text x="360" y="264" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="16" fontWeight="900">{successes}/{trials || 0} başarı</text>
            <text x="360" y="424" textAnchor="middle" fill="#BEF264" fontSize="18" fontWeight="900">30 atıştan sonra oran 0.40'a oturur</text>
          </>
        ) : null}

        {activeIndex === 3 ? (
          <>
            <rect x="130" y="205" width="460" height="60" rx="30" fill="rgba(255,255,255,0.08)" />
            <motion.rect x="130" y="205" width={460 * projectedFill} height="60" rx="30" fill="#00FF88" filter="url(#radar-glow)" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.3, repeat: Infinity }} />
            <text x="360" y="165" textAnchor="middle" fill="#00FF88" fontSize="36" fontWeight="900">{projection}/1000</text>
            <text x="360" y="305" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="16" fontWeight="900">küçük örneklem oranı büyük evrene yansır</text>
            <text x="360" y="430" textAnchor="middle" fill="#BEF264" fontSize="18" fontWeight="900">0.40 x 1000 = 400</text>
          </>
        ) : null}
      </svg>
    </section>
  );
}

interface RadarControlsProps {
  mission: MissionStep;
  activeIndex: number;
  groupChoice: GroupChoice;
  compression: number;
  medianScanner: number;
  trials: number;
  observedProbability: number;
  projection: number;
  deviations: Record<GroupChoice, number>;
  setGroupChoice: (value: GroupChoice) => void;
  setCompression: (value: number) => void;
  setMedianScanner: (value: number) => void;
  runTrials: () => void;
  setProjection: (value: number) => void;
  onCheck: () => void;
  onReset: () => void;
}

function RadarControls(props: RadarControlsProps) {
  const { mission, activeIndex, groupChoice, compression, medianScanner, trials, observedProbability, projection, deviations, setGroupChoice, setCompression, setMedianScanner, runTrials, setProjection, onCheck, onReset } = props;

  return (
    <aside className="rounded-[34px] border border-lime-200/18 bg-black/45 p-5 backdrop-blur-xl">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-lime-100/55">radar görevi {activeIndex + 1}/4</p>
      <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-lime-50/70">{mission.prompt}</p>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.045] p-4">
        {activeIndex === 0 ? (
          <div className="space-y-3">
            {(['A', 'B', 'C'] as GroupChoice[]).map((group) => (
              <button
                key={group}
                data-testid={`stats-cloud-${group.toLowerCase()}`}
                onClick={() => setGroupChoice(group)}
                className={`min-h-[54px] w-full rounded-2xl border px-4 text-left font-black transition ${groupChoice === group ? 'border-lime-200/45 bg-lime-200/12 text-lime-100' : 'border-white/10 bg-white/5 text-white/70 hover:border-lime-200/35'}`}
              >
                Sınıf {group} <span className="ml-2 font-mono text-xs text-white/45">σ={deviations[group].toFixed(1)}</span>
              </button>
            ))}
            <ExperimentSlider testId="stats-compression" label="seçili bulutu sıkıştır" value={compression} onChange={setCompression} completeValue={100} />
          </div>
        ) : null}
        {activeIndex === 1 ? (
          <ExperimentSlider testId="stats-median-scanner" label={`tarayıcı: ${medianScanner}`} value={medianScanner} min={42} max={96} onChange={setMedianScanner} completeValue={70} />
        ) : null}
        {activeIndex === 2 ? (
          <div className="space-y-4">
            <SciFiButton data-testid="stats-run-trials" variant="secondary" onClick={runTrials} className="min-h-[54px] w-full" icon={<Play className="h-4 w-4" />}>
              10 Deney Çalıştır
            </SciFiButton>
            <div className="rounded-2xl border border-lime-200/15 bg-lime-200/[0.06] p-4 font-mono text-sm text-lime-50">
              {trials} atış, oran {observedProbability.toFixed(2)}
            </div>
          </div>
        ) : null}
        {activeIndex === 3 ? (
          <ExperimentSlider testId="stats-projection" label={`1000 atış projeksiyonu: ${projection}`} value={projection} min={250} max={650} onChange={setProjection} completeValue={400} />
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <SciFiButton data-testid="stats-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          Veriyi Onayla
        </SciFiButton>
        <SciFiButton data-testid="stats-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>
      <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-xs leading-relaxed text-cyan-50/70">
        <Radar className="mb-2 h-4 w-4 text-cyan-200" />
        Radarın amacı cevap ezberi değil; verinin davranışını hareket ettirerek görmek.
      </div>
    </aside>
  );
}

function ExperimentSlider({ testId, label, value, onChange, min = 0, max = 100, completeValue }: { testId: string; label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; completeValue: number }) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <BarChart3 className="h-4 w-4 text-[#BEF264]" /> {label}
      </span>
      <input data-testid={testId} type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-12 w-full accent-[#BEF264]" />
      <button type="button" data-testid={`${testId}-complete`} onClick={() => onChange(completeValue)} className="mt-3 min-h-[44px] w-full rounded-xl border border-lime-200/20 bg-lime-200/10 text-sm font-black uppercase tracking-wider text-lime-100 hover:border-lime-200/45">
        Hedefe Sürükle
      </button>
    </label>
  );
}
