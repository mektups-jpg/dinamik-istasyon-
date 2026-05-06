import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { decoyDivisors, divisorTileTestIds, fullDivisors, primeFactors, primeLaserTestIds, scannerX, vaultFrame } from './primeVaultModel';
import { PrimeVaultMeasure, PrimeVaultState, PrimeVaultTarget } from './types';

interface PrimeVaultSceneProps {
  state: PrimeVaultState;
  activeIndex: number;
  target: PrimeVaultTarget;
  measure: PrimeVaultMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onTogglePrime: (value: number) => void;
  onToggleDivisor: (value: number) => void;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function PrimeVaultScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onTogglePrime,
  onToggleDivisor,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: PrimeVaultSceneProps) {
  const scanX = scannerX(state.scannerProgress);
  const targetX = scannerX(target.targetProgress);
  const allDivisors = [...fullDivisors, ...decoyDivisors].sort((a, b) => a - b);

  return (
    <section
      data-testid="prime-vault-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.14),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.1.1</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Asal Kilit Kasası</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${vaultFrame.width} ${vaultFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="prime-vault-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="prime-vault-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={vaultFrame.width} height={vaultFrame.height} fill="url(#prime-vault-grid)" />
        <rect x="62" y="52" width="776" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        <line x1={vaultFrame.railLeft} y1={vaultFrame.railY} x2={vaultFrame.railRight} y2={vaultFrame.railY} stroke="rgba(34,211,238,0.28)" strokeWidth="14" strokeLinecap="round" />
        <line x1={targetX} y1="108" x2={targetX} y2="250" stroke={target.accent} strokeDasharray="8 10" strokeWidth="3" />
        <VaultScanner x={scanX} progress={state.scannerProgress} color={target.accent} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />

        <g>
          <rect x="324" y="236" width="252" height="118" rx="34" fill={missionOk ? 'rgba(110,231,183,0.16)' : 'rgba(0,0,0,0.28)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.16)'} strokeWidth="4" filter="url(#prime-vault-glow)" />
          <text x="450" y="282" textAnchor="middle" fill="#FEF3C7" fontSize="20" fontWeight="950">HEDEF SAYI</text>
          <text x="450" y="326" textAnchor="middle" fill="#fff" fontSize="48" fontWeight="950">{measure.number}</text>
        </g>

        <g>
          {primeFactors.map((value, index) => (
            <LaserButton
              key={value}
              testId={primeLaserTestIds[value]}
              x={210 + index * 116}
              y={398}
              value={value}
              active={state.selectedPrimes.includes(value)}
              onClick={() => onTogglePrime(value)}
            />
          ))}
          <text x="326" y="490" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="13" fontWeight="900">asal lazer çekirdeği: {measure.selectedPrimeLabel}</text>
        </g>

        <g>
          {allDivisors.map((value, index) => {
            const col = index % 7;
            const row = Math.floor(index / 7);
            return (
              <DivisorTile
                key={value}
                value={value}
                x={96 + col * 102}
                y={518 + row * 54}
                active={state.selectedDivisors.includes(value)}
                valid={fullDivisors.includes(value)}
                onClick={() => onToggleDivisor(value)}
              />
            );
          })}
        </g>
        <FormulaReadout activeIndex={activeIndex} measure={measure} missionOk={missionOk} />
      </svg>
    </section>
  );
}

function VaultScanner({ x, progress, color, onPointerDown, onKeyDown }: {
  x: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="prime-vault-scanner"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Asal kasa tarayıcı kolu"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      transform={`translate(${x} ${vaultFrame.railY})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      <circle r="34" fill="transparent" />
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#prime-vault-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="950">SCAN</text>
    </g>
  );
}

function LaserButton({ testId, x, y, value, active, onClick }: { testId: string; x: number; y: number; value: number; active: boolean; onClick: () => void }) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r="40" fill={active ? 'rgba(34,211,238,0.22)' : 'rgba(0,0,0,0.26)'} stroke={active ? '#22D3EE' : 'rgba(255,255,255,0.16)'} strokeWidth="4" filter={active ? 'url(#prime-vault-glow)' : undefined} />
      <text x={x} y={y + 9} textAnchor="middle" fill="#fff" fontSize="26" fontWeight="950">{value}</text>
    </g>
  );
}

function DivisorTile({ value, x, y, active, valid, onClick }: { value: number; x: number; y: number; active: boolean; valid: boolean; onClick: () => void }) {
  return (
      <g data-testid={valid ? divisorTileTestIds[value] : undefined} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width="72" height="40" rx="16" fill={active ? (valid ? 'rgba(251,191,36,0.22)' : 'rgba(248,113,113,0.2)') : 'rgba(0,0,0,0.25)'} stroke={active ? (valid ? '#FBBF24' : '#F87171') : 'rgba(255,255,255,0.13)'} strokeWidth="2" />
      <text x={x + 36} y={y + 27} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="950">{value}</text>
    </g>
  );
}

function FormulaReadout({ activeIndex, measure, missionOk }: { activeIndex: number; measure: PrimeVaultMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="238" y="112" width="424" height="52" rx="22" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="134" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12" fontWeight="900">kasa {activeIndex + 1}/2</text>
      <motion.text
        x="450"
        y="154"
        textAnchor="middle"
        fill={missionOk ? '#D1FAE5' : '#E0F2FE'}
        fontSize="16"
        fontWeight="950"
        animate={{ opacity: missionOk ? [0.62, 1, 0.62] : 1 }}
        transition={{ duration: 1.2, repeat: missionOk ? Infinity : 0 }}
      >
        {missionOk ? `30 = ${measure.primeProduct} · ${measure.divisorCount} tam bölen` : 'Kilit sonucu doğru seçimden sonra açılır'}
      </motion.text>
    </g>
  );
}
