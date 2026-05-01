import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { PowerKey, PowerPlaced, PowerPositions, ReactorPointerHandler, RootKey, RootPlaced, RootPositions } from './types';
import { powerSlots, rootSlots } from './reactorModel';

interface RadicalSceneProps {
  activeIndex: number;
  powerPositions: PowerPositions;
  rootPositions: RootPositions;
  powerPlaced: PowerPlaced;
  rootPlaced: RootPlaced;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: ReactorPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onPowerSlotSelect: (key: PowerKey) => void;
  onRootSlotSelect: (key: RootKey) => void;
}

export function RadicalScene(props: RadicalSceneProps) {
  const { activeIndex, powerPositions, rootPositions, powerPlaced, rootPlaced, svgRef, onPointerDown, onPointerMove, onPointerUp, onPowerSlotSelect, onRootSlotSelect } = props;
  const powerComplete = powerPlaced.cube && powerPlaced.square;
  const rootComplete = rootPlaced.square && rootPlaced.remainder;

  return (
    <section data-testid="radical-scene" className="relative min-w-0 max-w-full overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.075] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-5">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-8 h-60 w-60 rounded-full bg-emerald-300/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl" />
      <div className="relative mb-4 grid gap-3 xl:flex xl:flex-wrap xl:items-center xl:justify-between">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/52">makro atom: MAT.9.1.1.x / MAT.9.1.2.x</p>
          <h2 className="text-2xl font-black tracking-tight text-white">Enerji Çekirdeğini Kalibre Et</h2>
        </div>
        <div className={`max-w-full justify-self-start rounded-full border px-4 py-2 font-mono text-sm font-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl ${powerComplete || rootComplete ? 'border-emerald-300/28 bg-emerald-200/12 text-emerald-50' : 'border-white/12 bg-white/[0.08] text-white/82'}`}>
          {activeIndex === 0 ? (powerComplete ? '2³ x 2² = 2⁵ = 32' : 'aynı taban: 2') : (rootComplete ? '√72 = 6√2' : '72 = 36 x 2')}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 500"
        className="relative h-[330px] w-full max-w-full touch-none rounded-[28px] border border-white/10 bg-[#07120f]/92 shadow-inner shadow-black/55 sm:h-[360px] md:h-[420px] xl:h-[520px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <filter id="reactor-v4-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="reactor-v5-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="rgba(0,0,0,0.45)" />
          </filter>
          <linearGradient id="reactor-v5-core" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(110,231,183,0.38)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.10)" />
          </linearGradient>
          <linearGradient id="reactor-v5-token" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(103,232,249,0.24)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.10)" />
          </linearGradient>
          <linearGradient id="reactor-v5-root" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(253,230,138,0.26)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0.12)" />
          </linearGradient>
          <radialGradient id="reactor-v5-stage-light" cx="50%" cy="42%" r="64%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.055)" />
            <stop offset="54%" stopColor="rgba(52,211,153,0.03)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <pattern id="reactor-v5-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="720" height="500" fill="rgba(4,8,7,0.94)" />
        <rect width="720" height="500" fill="url(#reactor-v5-grid)" />
        <rect width="720" height="500" fill="url(#reactor-v5-stage-light)" />
        {activeIndex === 0 ? (
          <PowerFusion powerPositions={powerPositions} powerPlaced={powerPlaced} onPointerDown={onPointerDown} onSlotSelect={onPowerSlotSelect} />
        ) : (
          <RootExtractor rootPositions={rootPositions} rootPlaced={rootPlaced} onPointerDown={onPointerDown} onSlotSelect={onRootSlotSelect} />
        )}
      </svg>
    </section>
  );
}

function PowerFusion({ powerPositions, powerPlaced, onPointerDown, onSlotSelect }: { powerPositions: PowerPositions; powerPlaced: PowerPlaced; onPointerDown: ReactorPointerHandler; onSlotSelect: (key: PowerKey) => void }) {
  const complete = powerPlaced.cube && powerPlaced.square;
  return (
    <>
      <circle cx="360" cy="252" r="196" fill="rgba(255,255,255,0.018)" />
      <circle cx="360" cy="252" r="146" fill="rgba(16,185,129,0.035)" stroke="rgba(110,231,183,0.18)" strokeWidth="2" />
      <motion.circle data-testid="radical-reactor-target" cx="360" cy="258" r="102" fill="url(#reactor-v5-core)" stroke={complete ? '#86EFAC' : 'rgba(110,231,183,0.42)'} strokeWidth="4" strokeDasharray={complete ? undefined : '12 12'} filter="url(#reactor-v4-glow)" animate={{ opacity: complete ? [0.88, 1, 0.88] : [0.62, 0.9, 0.62] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <line x1="142" y1="326" x2="578" y2="326" stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeDasharray="14 16" />
      <SlotPoint testId="radical-power-slot-cube" x={powerSlots.cube.x} y={powerSlots.cube.y} active={powerPlaced.cube} label="üs 3" onSelect={() => onSlotSelect('cube')} />
      <SlotPoint testId="radical-power-slot-square" x={powerSlots.square.x} y={powerSlots.square.y} active={powerPlaced.square} label="üs 2" onSelect={() => onSlotSelect('square')} />
      <PowerToken testId="radical-power-left" x={powerPositions.cube.x} y={powerPositions.cube.y} label="2³" placed={powerPlaced.cube} onPointerDown={(event) => onPointerDown(event, { kind: 'power', key: 'cube' })} />
      <PowerToken testId="radical-power-right" x={powerPositions.square.x} y={powerPositions.square.y} label="2²" placed={powerPlaced.square} onPointerDown={(event) => onPointerDown(event, { kind: 'power', key: 'square' })} />
      <motion.text x="360" y="114" textAnchor="middle" fill="#FEF3C7" fontSize="21" fontWeight="900" animate={{ opacity: [0.62, 1, 0.62] }} transition={{ duration: 1.5, repeat: Infinity }}>
        Aynı taban korunur, üstler birleşir
      </motion.text>
      <ResultReadout complete={complete} primary={complete ? '2³ x 2² = 2³⁺² = 2⁵' : '2³ x 2²'} secondary={complete ? '2⁵ = 32 enerji birimi' : 'iki çekirdeği füzyon yuvalarına taşı'} />
    </>
  );
}

function RootExtractor({ rootPositions, rootPlaced, onPointerDown, onSlotSelect }: { rootPositions: RootPositions; rootPlaced: RootPlaced; onPointerDown: ReactorPointerHandler; onSlotSelect: (key: RootKey) => void }) {
  const complete = rootPlaced.square && rootPlaced.remainder;
  return (
    <>
      <rect x="80" y="118" width="278" height="278" rx="44" fill="rgba(255,255,255,0.026)" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <motion.path d="M128 276 L182 276 L200 198 L256 198" fill="none" stroke="#67E8F9" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" filter="url(#reactor-v4-glow)" animate={{ opacity: [0.68, 1, 0.68] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <text x="240" y="286" textAnchor="middle" fill="#ECFEFF" fontSize="54" fontWeight="900">72</text>
      <text x="218" y="356" textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="16" fontWeight="900">72 = 36 x 2</text>
      <line x1="386" y1="252" x2="462" y2="180" stroke="rgba(253,230,138,0.25)" strokeWidth="3" strokeDasharray="10 10" />
      <line x1="386" y1="252" x2="462" y2="326" stroke="rgba(196,181,253,0.24)" strokeWidth="3" strokeDasharray="10 10" />
      <RootSlot testId="radical-root-outside" x={rootSlots.square.x} y={rootSlots.square.y} active={rootPlaced.square} label="dış hazne" hint="√36 -> 6" onSelect={() => onSlotSelect('square')} />
      <RootSlot testId="radical-root-inside" x={rootSlots.remainder.x} y={rootSlots.remainder.y} active={rootPlaced.remainder} label="kök haznesi" hint="√2 kalır" onSelect={() => onSlotSelect('remainder')} />
      <RootToken testId="radical-root-square" x={rootPositions.square.x} y={rootPositions.square.y} label="√36" sublabel="tam kare" placed={rootPlaced.square} tone="amber" onPointerDown={(event) => onPointerDown(event, { kind: 'root', key: 'square' })} />
      <RootToken testId="radical-root-remainder" x={rootPositions.remainder.x} y={rootPositions.remainder.y} label="√2" sublabel="kalır" placed={rootPlaced.remainder} tone="violet" onPointerDown={(event) => onPointerDown(event, { kind: 'root', key: 'remainder' })} />
      <ResultReadout complete={complete} primary={complete ? '√72 = √(36 x 2) = 6√2' : '√72 kristalini ayır'} secondary={complete ? 'tam kare dışarı 6 olarak çıktı' : 'tam kare dışarı, kalan parça kökün içinde'} />
    </>
  );
}

function PowerToken({ testId, x, y, label, placed, onPointerDown }: { testId: string; x: number; y: number; label: string; placed: boolean; onPointerDown: (event: ReactPointerEvent<SVGElement>) => void }) {
  return (
    <g data-testid={testId} onPointerDown={(event) => !placed && onPointerDown(event)} style={{ cursor: placed ? 'default' : 'grab', touchAction: 'none' }}>
      <circle cx={x} cy={y} r="64" fill="transparent" />
      <motion.circle cx={x} cy={y} r="48" fill={placed ? 'rgba(134,239,172,0.18)' : 'url(#reactor-v5-token)'} stroke={placed ? '#86EFAC' : '#67E8F9'} strokeWidth="4" filter="url(#reactor-v4-glow)" animate={{ scale: placed ? 1 : [0.98, 1.04, 0.98] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <text x={x} y={y + 10} textAnchor="middle" fill="#fff" fontSize="30" fontWeight="900">{label}</text>
    </g>
  );
}

function RootToken({ testId, x, y, label, sublabel, placed, tone, onPointerDown }: { testId: string; x: number; y: number; label: string; sublabel: string; placed: boolean; tone: 'amber' | 'violet'; onPointerDown: (event: ReactPointerEvent<SVGElement>) => void }) {
  const stroke = tone === 'amber' ? '#FBBF24' : '#B388FF';
  const fill = tone === 'amber' ? 'rgba(251,191,36,0.16)' : 'rgba(179,136,255,0.16)';
  return (
    <g data-testid={testId} onPointerDown={(event) => !placed && onPointerDown(event)} style={{ cursor: placed ? 'default' : 'grab', touchAction: 'none' }}>
      <rect x={x - 64} y={y - 52} width="128" height="104" rx="24" fill="transparent" />
      <motion.rect
        x={x - 50}
        y={y - 38}
        width="100"
        height="76"
        rx="20"
        fill={placed ? 'rgba(134,239,172,0.16)' : fill}
        stroke={placed ? '#86EFAC' : stroke}
        strokeWidth="4"
        filter="url(#reactor-v4-glow)"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={{ opacity: placed ? 1 : [0.88, 1, 0.88], scale: placed ? 1 : [0.99, 1.025, 0.99] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <text x={x} y={y - 2} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">{label}</text>
      <text x={x} y={y + 24} textAnchor="middle" fill={placed ? '#DCFCE7' : stroke} fontSize="14" fontWeight="900">{sublabel}</text>
    </g>
  );
}

function SlotPoint({ testId, x, y, active, label, onSelect }: { testId: string; x: number; y: number; active: boolean; label: string; onSelect: () => void }) {
  return (
    <g data-testid={testId} role="button" aria-label={`${label} yuvası`} onClick={onSelect} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r="54" fill="transparent" />
      <circle cx={x} cy={y} r="44" fill="rgba(0,0,0,0.28)" stroke={active ? '#86EFAC' : 'rgba(255,255,255,0.22)'} strokeWidth="4" strokeDasharray={active ? undefined : '7 9'} />
      <text x={x} y={y + 8} textAnchor="middle" fill={active ? '#86EFAC' : 'rgba(255,255,255,0.50)'} fontSize="18" fontWeight="900">{label}</text>
    </g>
  );
}

function RootSlot({ testId, x, y, active, label, hint, onSelect }: { testId: string; x: number; y: number; active: boolean; label: string; hint: string; onSelect: () => void }) {
  return (
    <g data-testid={testId} role="button" aria-label={`${label} seç`} onClick={onSelect} style={{ cursor: 'pointer' }}>
      <rect x={x - 94} y={y - 56} width="188" height="112" rx="28" fill="transparent" />
      <rect x={x - 86} y={y - 50} width="172" height="100" rx="26" fill={active ? 'rgba(134,239,172,0.09)' : 'rgba(255,255,255,0.045)'} stroke={active ? '#86EFAC' : 'rgba(255,255,255,0.18)'} strokeWidth="4" strokeDasharray={active ? undefined : '8 9'} />
      <text x={x} y={y - 66} textAnchor="middle" fill={active ? '#DCFCE7' : 'rgba(255,255,255,0.54)'} fontSize="14" fontWeight="900">{label}</text>
      <text x={x} y={y + 6} textAnchor="middle" fill={active ? '#86EFAC' : 'rgba(255,255,255,0.42)'} fontSize="15" fontWeight="900">{hint}</text>
    </g>
  );
}

function ResultReadout({ complete, primary, secondary }: { complete: boolean; primary: string; secondary: string }) {
  return (
    <g>
      <rect x="164" y="402" width="392" height="62" rx="24" fill={complete ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.045)'} stroke={complete ? 'rgba(134,239,172,0.30)' : 'rgba(255,255,255,0.09)'} />
      <text x="360" y="429" textAnchor="middle" fill={complete ? '#DCFCE7' : 'rgba(255,255,255,0.78)'} fontSize="22" fontWeight="900">{primary}</text>
      <text x="360" y="450" textAnchor="middle" fill={complete ? '#86EFAC' : 'rgba(255,255,255,0.48)'} fontSize="13" fontWeight="900">{secondary}</text>
    </g>
  );
}
