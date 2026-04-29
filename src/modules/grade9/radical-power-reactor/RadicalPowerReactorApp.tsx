import React, { useState } from 'react';
import { Check, Cpu, Layers3, RotateCcw, Sigma, SquareRadical, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChoiceButton,
  Grade9LabShell,
  MetricPill,
  MissionStep,
  useGrade9MissionProgress,
} from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { ReactorStage } from './RadicalReactorStage';

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
  {
    id: 'power-core',
    title: 'Üs Çekirdeği',
    atomId: 'MAT.9.1.1.2',
    prompt: 'Aynı tabanlı enerji bloklarını çarp. 2^3 ve 2^2 birleşince üsler toplanmalı.',
  },
  {
    id: 'radical-extractor',
    title: 'Kök Ayrıştırıcı',
    atomId: 'MAT.9.1.2.2',
    prompt: 'Kök içinden tam kare parçayı çıkar. √72 reaktöründe 36 ve 2 ayrımı aranıyor.',
  },
  {
    id: 'interval-gate',
    title: 'Aralık Kapıları',
    atomId: 'MAT.9.1.3.3',
    prompt: '[-2,4] ve (1,7] aralıklarının kesişimini seç. Sol kapı açık mı kapalı mı dikkat et.',
  },
  {
    id: 'real-umbrella',
    title: 'Gerçek Sayı Şemsiyesi',
    atomId: 'MAT.9.1.4.2',
    prompt: '√2 sinyalini doğru kümeye yerleştir. Rasyonel olmayan ama gerçek sayı olan bölgeyi bul.',
  },
  {
    id: 'property-law',
    title: 'İşlem Yasası',
    atomId: 'MAT.9.1.5.2',
    prompt: '3(x+2) ifadesini dağıtma özelliğiyle eşleştir. Çarpma, parantezin içine yayılmalı.',
  },
];

const OPTIONS = {
  power: [
    { id: '2^6', label: '2^6', detail: 'Üsleri çarpma hatası' },
    { id: '2^5', label: '2^5', detail: '3+2 enerji seviyesi' },
    { id: '4^5', label: '4^5', detail: 'Taban değişti' },
  ],
  radical: [
    { id: '36sqrt2', label: '36√2', detail: 'Tam kare dışarı kök olarak kaldı' },
    { id: '6sqrt2', label: '6√2', detail: '√36 dışarı 6 çıkar' },
    { id: '8sqrt9', label: '8√9', detail: 'Ayrışım tamamlanmadı' },
  ],
  interval: [
    { id: '[1,4]', label: '[1,4]', detail: '1 dahil sanıldı' },
    { id: '(1,4]', label: '(1,4]', detail: '1 açık, 4 kapalı' },
    { id: '[-2,7]', label: '[-2,7]', detail: 'Birleşim seçildi' },
  ],
  set: [
    { id: 'natural', label: 'Doğal Sayı', detail: 'Negatif ve kesir yoktur' },
    { id: 'rational', label: 'Rasyonel', detail: 'a/b biçimi gerekir' },
    { id: 'irrational-real', label: 'İrrasyonel Gerçek', detail: '√2 bu bölgede yaşar' },
  ],
  law: [
    { id: '3x+6', label: '3x + 6', detail: 'Dağıtma kilidi' },
    { id: '3x+2', label: '3x + 2', detail: '2 çarpılmadı' },
    { id: 'x+6', label: 'x + 6', detail: 'x çarpılmadı' },
  ],
};

type ChoiceState = {
  power: string;
  radical: string;
  interval: string;
  set: string;
  law: string;
};

const INITIAL_CHOICES: ChoiceState = {
  power: '',
  radical: '',
  interval: '',
  set: '',
  law: '',
};

const ANSWERS: ChoiceState = {
  power: '2^5',
  radical: '6sqrt2',
  interval: '(1,4]',
  set: 'irrational-real',
  law: '3x+6',
};

const missionKeys: Array<keyof ChoiceState> = ['power', 'radical', 'interval', 'set', 'law'];

export default function RadicalPowerReactorApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [choices, setChoices] = useState<ChoiceState>(INITIAL_CHOICES);
  const activeKey = missionKeys[progress.activeIndex] ?? 'power';

  const updateChoice = (key: keyof ChoiceState, value: string) => {
    setChoices((current) => ({ ...current, [key]: value }));
  };

  const resetPanel = () => {
    setChoices(INITIAL_CHOICES);
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: choices[activeKey] === ANSWERS[activeKey],
      success: 'Reaktör bloğu doğru sadeleşti. Bir sonraki istasyon açılıyor.',
      error: 'Sadeleşme hedefe uymadı. Kapı işaretlerini, üs toplamını veya kök ayrışımını tekrar incele.',
    });
  };

  return (
    <Grade9LabShell
      title="Kök ve Üs Reaktörü"
      subtitle="MAT.9.1.1.x - MAT.9.1.5.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={progress.activeIndex}
      completed={progress.completed}
      onRestart={restart}
      frameClassName="bg-[#080b05] [background-image:radial-gradient(circle_at_20%_18%,rgba(0,255,136,0.18),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(251,191,36,0.14),transparent_25%),linear-gradient(180deg,#080b05_0%,#08150e_52%,#050806_100%)]"
      badges={[
        { label: 'İstasyon', value: String(progress.activeIndex + 1), tone: 'amber' },
        { label: 'Seçim', value: choices[activeKey] || 'bekliyor', tone: 'cyan' },
      ]}
    >
      <div className="space-y-4">
        <ReactorBrief activeMission={progress.activeMission} activeIndex={progress.activeIndex} total={MISSIONS.length} activeKey={activeKey} />
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-[2rem_0.8rem_2rem_0.8rem] border border-emerald-300/15 bg-emerald-950/20 p-4 shadow-[inset_0_0_35px_rgba(0,255,136,0.05)]">
          <div className="mb-4 flex flex-wrap gap-2">
            <MetricPill variant="reactor" label="Üs Motoru" value={choices.power || '2^3 * 2^2'} tone="cyan" />
            <MetricPill variant="reactor" label="Kök Motoru" value={choices.radical || '√72'} tone="green" />
            <MetricPill variant="reactor" label="Aralık" value={choices.interval || '[-2,4] ∩ (1,7]'} tone="purple" />
          </div>

          <ReactorVisual activeKey={activeKey} choices={choices} />
        </div>

        <div className="min-w-0 space-y-4">
          <StationHeader activeKey={activeKey} />
          <div className="grid gap-3">
            {OPTIONS[activeKey].map((option, index) => (
              <ChoiceButton
                variant="reactor"
                key={option.id}
                testId={`radical-${activeKey}-${index}-${option.id.replace(/[^a-z0-9-]/gi, '-')}`}
                selected={choices[activeKey] === option.id}
                label={option.label}
                detail={option.detail}
                onClick={() => updateChoice(activeKey, option.id)}
                tone={activeKey === 'radical' ? 'green' : activeKey === 'interval' ? 'purple' : activeKey === 'law' ? 'amber' : 'cyan'}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <SciFiButton data-testid="radical-check" onClick={handleCheck} className="min-h-[48px] flex-1" icon={<Check className="h-4 w-4" />}>
              Reaktörü Kilitle
            </SciFiButton>
            <SciFiButton data-testid="radical-reset" variant="secondary" onClick={resetPanel} className="min-h-[48px] flex-1" icon={<RotateCcw className="h-4 w-4" />}>
              Paneli Sıfırla
            </SciFiButton>
          </div>
        </div>
      </div>
      </div>
    </Grade9LabShell>
  );
}

function ReactorBrief({ activeMission, activeIndex, total, activeKey }: { activeMission: MissionStep; activeIndex: number; total: number; activeKey: keyof ChoiceState }) {
  return (
    <section className="relative overflow-hidden rounded-[32px_12px_32px_12px] border border-emerald-300/20 bg-emerald-300/[0.055] p-5 shadow-[0_0_45px_rgba(0,255,136,0.10)]">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-emerald-300/20 bg-emerald-300/10 shadow-[0_0_55px_rgba(0,255,136,0.16)]" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-emerald-200/65">reaktör istasyonu {activeIndex + 1}/{total}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{activeMission.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-50/70">{activeMission.prompt}</p>
        </div>
        <div className="grid w-full min-w-0 grid-cols-3 gap-2 rounded-[24px_10px_24px_10px] border border-emerald-300/15 bg-black/30 p-3 lg:w-[260px] lg:shrink-0">
          {(['power', 'radical', 'interval'] as Array<keyof ChoiceState>).map((key) => (
            <div key={key} className={`h-14 rounded-xl border ${activeKey === key ? 'border-emerald-300/55 bg-emerald-300/15' : 'border-white/10 bg-white/5'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ReactorVisualProps {
  activeKey: keyof ChoiceState;
  choices: ChoiceState;
}

function ReactorVisual({ activeKey, choices }: ReactorVisualProps) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-black/45 p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,229,255,0.18),transparent_46%)]" />
      <div className="relative grid h-full gap-4 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex min-h-[310px] items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="relative h-64 w-64 rounded-full border border-[#00E5FF]/25"
          >
            <div className="absolute inset-10 rounded-full border border-[#B388FF]/25" />
            <div className="absolute inset-[74px] rounded-full border border-[#00FF88]/25" />
            {['2^3', '2^2', '√72', 'R'].map((label, index) => (
              <motion.div
                key={label}
                className="absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 font-mono text-sm font-black text-white shadow-[0_0_20px_rgba(0,229,255,0.18)]"
                style={{
                  left: `${50 + Math.cos((index * Math.PI) / 2) * 39}%`,
                  top: `${50 + Math.sin((index * Math.PI) / 2) * 39}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {label}
              </motion.div>
            ))}
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-center font-black text-[#00E5FF]">
              {choices[activeKey] || 'SEÇ'}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-3">
          <ReactorStage activeKey={activeKey} choices={choices} />
          <FormulaCard icon={<Zap className="h-5 w-5" />} title="Üs Kuralı" text="Aynı taban çarpılırken üsler toplanır: a^m * a^n = a^(m+n)." active={activeKey === 'power'} />
          <FormulaCard icon={<SquareRadical className="h-5 w-5" />} title="Kök Çıkarma" text="Tam kare parça dışarı çıkar: √72 = √36 * √2 = 6√2." active={activeKey === 'radical'} />
          <FormulaCard icon={<Layers3 className="h-5 w-5" />} title="Aralık Mantığı" text="Açık kapı uç noktayı almaz, kapalı kapı dahil eder." active={activeKey === 'interval'} />
          <FormulaCard icon={<Cpu className="h-5 w-5" />} title="Gerçek Sayılar" text="Rasyonel ve irrasyonel kümeler birlikte gerçek sayıları oluşturur." active={activeKey === 'set'} />
          <FormulaCard icon={<Sigma className="h-5 w-5" />} title="Dağıtma" text="Çarpan parantezdeki her terime yayılır." active={activeKey === 'law'} />
        </div>
      </div>
    </div>
  );
}

interface FormulaCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  active: boolean;
}

function FormulaCard({ icon, title, text, active }: FormulaCardProps) {
  return (
    <div className={`rounded-2xl border p-3 ${active ? 'border-[#00E5FF]/35 bg-[#00E5FF]/10' : 'border-white/10 bg-white/[0.045]'}`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-black text-white">
        <span className={active ? 'text-[#00E5FF]' : 'text-white/45'}>{icon}</span>
        {title}
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

function StationHeader({ activeKey }: { activeKey: keyof ChoiceState }) {
  const titles: Record<keyof ChoiceState, string> = {
    power: 'Üs bloklarını çarpıştır',
    radical: 'Kök içini ayrıştır',
    interval: 'Kapı kesişimini oku',
    set: 'Sayı kümesini seç',
    law: 'İşlem özelliğini kilitle',
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00E5FF]/70">Aktif Reaktör Konsolu</p>
      <h4 className="mt-1 text-lg font-black text-white">{titles[activeKey]}</h4>
    </div>
  );
}
