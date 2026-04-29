import { motion } from 'motion/react';

type ReactorChoiceKey = 'power' | 'radical' | 'interval' | 'set' | 'law';

interface ReactorStageProps {
  activeKey: ReactorChoiceKey;
  choices: Record<ReactorChoiceKey, string>;
}

const stageTitle: Record<ReactorChoiceKey, string> = {
  power: 'Enerji çekirdekleri üsleri topluyor',
  radical: 'Tam kare parça kökten ayrılıyor',
  interval: 'Kapılar sadece kesişim bölgesini açık bırakıyor',
  set: '√2 rasyonel dışı gerçek bölgeye düşüyor',
  law: '3 çarpanı parantezin iki terimine yayılıyor',
};

export function ReactorStage({ activeKey, choices }: ReactorStageProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem_0.7rem_1.6rem_0.7rem] border border-emerald-300/18 bg-black/35 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.13),transparent_38%)]" />
      <p className="relative font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/55">canlı reaktör kesiti</p>
      <h4 className="relative mt-1 text-sm font-black text-white">{stageTitle[activeKey]}</h4>
      <svg viewBox="0 0 360 170" className="relative mt-3 h-[170px] w-full">
        <defs>
          <filter id="reactor-stage-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {activeKey === 'power' ? <PowerCoreStage value={choices.power || '2^(3+2)'} /> : null}
        {activeKey === 'radical' ? <RadicalExtractorStage value={choices.radical || '6√2'} /> : null}
        {activeKey === 'interval' ? <IntervalGateStage value={choices.interval || '(1,4]'} /> : null}
        {activeKey === 'set' ? <SetUmbrellaStage value={choices.set || 'irrasyonel gerçek'} /> : null}
        {activeKey === 'law' ? <DistributiveStage value={choices.law || '3x+6'} /> : null}
      </svg>
    </div>
  );
}

function PowerCoreStage({ value }: { value: string }) {
  return (
    <>
      <path d="M72 86 H154 M206 86 H288" stroke="#00FF88" strokeWidth="6" strokeLinecap="round" filter="url(#reactor-stage-glow)" />
      <motion.circle cx="72" cy="86" r="30" fill="rgba(0,255,136,0.14)" stroke="#00FF88" animate={{ cx: [72, 100, 72] }} transition={{ duration: 1.7, repeat: Infinity }} />
      <motion.circle cx="288" cy="86" r="30" fill="rgba(251,191,36,0.14)" stroke="#FBBF24" animate={{ cx: [288, 260, 288] }} transition={{ duration: 1.7, repeat: Infinity }} />
      <text x="72" y="92" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">2³</text>
      <text x="288" y="92" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">2²</text>
      <circle cx="180" cy="86" r="42" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="3" filter="url(#reactor-stage-glow)" />
      <text x="180" y="93" textAnchor="middle" fill="#00E5FF" fontSize="20" fontWeight="900">{value}</text>
    </>
  );
}

function RadicalExtractorStage({ value }: { value: string }) {
  return (
    <>
      <rect x="35" y="58" width="96" height="58" rx="16" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="3" />
      <text x="83" y="94" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900">√72</text>
      <path d="M140 86 H214" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 8" />
      <motion.rect x="224" y="42" width="58" height="58" rx="14" fill="rgba(0,255,136,0.13)" stroke="#00FF88" animate={{ y: [42, 34, 42] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <rect x="224" y="102" width="58" height="38" rx="12" fill="rgba(179,136,255,0.12)" stroke="#B388FF" />
      <text x="253" y="78" textAnchor="middle" fill="#00FF88" fontSize="16" fontWeight="900">√36</text>
      <text x="253" y="126" textAnchor="middle" fill="#B388FF" fontSize="16" fontWeight="900">√2</text>
      <text x="314" y="94" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">{value}</text>
    </>
  );
}

function IntervalGateStage({ value }: { value: string }) {
  return (
    <>
      <line x1="34" y1="90" x2="326" y2="90" stroke="rgba(255,255,255,0.34)" strokeWidth="4" strokeLinecap="round" />
      {[-2, 1, 4, 7].map((point, index) => {
        const x = [64, 154, 244, 316][index];
        const open = point === 1;
        return (
          <g key={point}>
            <line x1={x} y1="72" x2={x} y2="108" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            <circle cx={x} cy="90" r="10" fill={open ? '#050806' : '#00FF88'} stroke={open ? '#FBBF24' : '#00FF88'} strokeWidth="3" />
            <text x={x} y="132" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{point}</text>
          </g>
        );
      })}
      <motion.rect x="154" y="80" width="90" height="20" rx="10" fill="rgba(0,229,255,0.22)" animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x="199" y="55" textAnchor="middle" fill="#00E5FF" fontSize="15" fontWeight="900">{value}</text>
    </>
  );
}

function SetUmbrellaStage({ value }: { value: string }) {
  return (
    <>
      {[
        { r: 72, label: 'R', color: '#00E5FF' },
        { r: 52, label: 'Q', color: '#00FF88' },
        { r: 34, label: 'Z', color: '#FBBF24' },
      ].map((ring) => (
        <g key={ring.label}>
          <circle cx="174" cy="88" r={ring.r} fill="none" stroke={ring.color} strokeWidth="3" opacity="0.5" />
          <text x={174 + ring.r - 16} y="87" fill={ring.color} fontSize="14" fontWeight="900">{ring.label}</text>
        </g>
      ))}
      <motion.circle cx="232" cy="74" r="18" fill="rgba(179,136,255,0.2)" stroke="#B388FF" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x="232" y="80" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900">√2</text>
      <text x="174" y="158" textAnchor="middle" fill="#B388FF" fontSize="13" fontWeight="900">{value}</text>
    </>
  );
}

function DistributiveStage({ value }: { value: string }) {
  return (
    <>
      <circle cx="72" cy="86" r="28" fill="rgba(251,191,36,0.16)" stroke="#FBBF24" strokeWidth="3" />
      <text x="72" y="93" textAnchor="middle" fill="#fff" fontSize="21" fontWeight="900">3</text>
      <rect x="158" y="45" width="70" height="42" rx="13" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="3" />
      <rect x="158" y="100" width="70" height="42" rx="13" fill="rgba(0,255,136,0.12)" stroke="#00FF88" strokeWidth="3" />
      <path d="M101 82 C126 62 135 62 158 66 M101 90 C126 118 135 120 158 121" stroke="#FBBF24" strokeWidth="5" fill="none" strokeLinecap="round" />
      <text x="193" y="72" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">x</text>
      <text x="193" y="127" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900">2</text>
      <text x="291" y="94" textAnchor="middle" fill="#00E5FF" fontSize="20" fontWeight="900">{value}</text>
    </>
  );
}
