import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { FunctionTarget, MappingState, RelationScenario, ScannerPointerHandler } from './types';
import { formatValue, graphConfig, graphToSvg, mappingPairs, outputPorts, portTestId } from './filterModel';

interface FunctionFilterSceneProps {
  target: FunctionTarget;
  scannerX: number;
  scenario: RelationScenario;
  hitCount: number;
  missionOk: boolean;
  mapping: MappingState;
  selectedInput: number | null;
  svgRef: RefObject<SVGSVGElement | null>;
  onScannerDown: ScannerPointerHandler;
  onScannerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onScannerUp: (event: ReactPointerEvent<SVGElement>) => void;
  onScannerStep: (delta: number) => void;
  onScannerSnap: () => void;
  onSelectInput: (input: number) => void;
  onSelectOutput: (output: number) => void;
}

export function FunctionFilterScene({
  target,
  scannerX,
  scenario,
  hitCount,
  missionOk,
  mapping,
  selectedInput,
  svgRef,
  onScannerDown,
  onScannerMove,
  onScannerUp,
  onScannerStep,
  onScannerSnap,
  onSelectInput,
  onSelectOutput,
}: FunctionFilterSceneProps) {
  const scanner = graphToSvg({ x: scannerX, y: 0 });
  const isMapping = target.kind === 'map-domain';

  return (
    <section
      data-testid="function-filter-scene"
      className="relative overflow-hidden rounded-[32px] border border-sky-200/18 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_18%,rgba(56,189,248,0.20),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(167,139,250,0.14),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/58">makro atom: MAT.10.2.1.x</p>
          <h2 className="text-2xl font-black text-white">{isMapping ? 'Fonksiyon Portlarını Bağla' : 'Dikey Lazer Filtresi'}</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/25 bg-sky-300/10 text-sky-100'}`}>
          {isMapping ? `${completedMappings(mapping)}/4 port` : `${hitCount} çıktı`}
        </div>
      </div>

      <svg
        ref={svgRef}
        data-testid="function-filter-svg"
        viewBox="0 0 720 520"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#03101d]/86 sm:h-[540px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onScannerMove}
        onPointerUp={onScannerUp}
        onPointerCancel={onScannerUp}
      >
        <defs>
          <pattern id="function-filter-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </pattern>
          <filter id="function-filter-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="function-filter-laser-glow">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="scanner-curtain" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(251,191,36,0)" />
            <stop offset="45%" stopColor="rgba(251,191,36,0.34)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.42)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0)" />
          </linearGradient>
        </defs>

        <rect width="720" height="520" fill="url(#function-filter-grid)" />
        <line x1="48" y1="270" x2="680" y2="270" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <line x1="360" y1="58" x2="360" y2="462" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <text x="666" y="294" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">x</text>
        <text x="376" y="76" fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="900">y</text>

        {isMapping ? (
          <MappingBoard mapping={mapping} selectedInput={selectedInput} onSelectInput={onSelectInput} onSelectOutput={onSelectOutput} />
        ) : (
          <ScannerBoard
            scannerX={scannerX}
            scannerSvgX={scanner.x}
            scenario={scenario}
            missionOk={missionOk}
            onScannerDown={onScannerDown}
            onScannerStep={onScannerStep}
            onScannerSnap={onScannerSnap}
          />
        )}
      </svg>
    </section>
  );
}

function ScannerBoard({
  scannerX,
  scannerSvgX,
  scenario,
  missionOk,
  onScannerDown,
  onScannerStep,
  onScannerSnap,
}: {
  scannerX: number;
  scannerSvgX: number;
  scenario: RelationScenario;
  missionOk: boolean;
  onScannerDown: ScannerPointerHandler;
  onScannerStep: (delta: number) => void;
  onScannerSnap: () => void;
}) {
  return (
    <>
      <text x="70" y="84" fill="#BAE6FD" fontSize="15" fontWeight="900">{scenario.title}</text>
      <text x="70" y="110" fill="rgba(255,255,255,0.60)" fontSize="13" fontWeight="800">Lazer bir x değerinde kaç noktaya çarpıyor?</text>
      {scenario.points.map((point, index) => {
        const svg = graphToSvg(point);
        const hit = Math.abs(point.x - scannerX) <= 0.18;
        return (
          <g key={point.id} data-testid={`relation-point-${index}`}>
            <motion.circle
              cx={svg.x}
              cy={svg.y}
              r={hit ? 19 : 14}
              fill={hit ? '#F472B6' : '#38BDF8'}
              stroke="#FFFFFF"
              strokeWidth="3"
              filter="url(#function-filter-glow)"
              animate={{ scale: hit ? [1, 1.12, 1] : 1 }}
              transition={{ duration: 0.7, repeat: hit ? Infinity : 0 }}
            />
            <text x={svg.x + 16} y={svg.y - 18} fill="rgba(255,255,255,0.78)" fontSize="12" fontWeight="900">{point.label}</text>
          </g>
        );
      })}

      <motion.rect
        data-testid="vertical-scanner-beam"
        x={scannerSvgX - 30}
        y="66"
        width="60"
        height="390"
        rx="30"
        fill="url(#scanner-curtain)"
        filter="url(#function-filter-laser-glow)"
        animate={{ opacity: missionOk ? [0.48, 0.78, 0.48] : [0.34, 0.62, 0.34] }}
        transition={{ duration: 1.05, repeat: Infinity }}
      />
      <line x1={scannerSvgX} y1="66" x2={scannerSvgX} y2="456" stroke={missionOk ? '#34D399' : '#FBBF24'} strokeWidth="18" strokeLinecap="round" opacity="0.16" filter="url(#function-filter-laser-glow)" />
      <motion.line
        x1={scannerSvgX}
        y1="66"
        x2={scannerSvgX}
        y2="456"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#function-filter-glow)"
        animate={{ opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 0.7, repeat: Infinity }}
      />
      <line x1={scannerSvgX - 18} y1="66" x2={scannerSvgX + 18} y2="66" stroke={missionOk ? '#34D399' : '#FBBF24'} strokeWidth="8" strokeLinecap="round" />
      <line x1={scannerSvgX - 18} y1="456" x2={scannerSvgX + 18} y2="456" stroke={missionOk ? '#34D399' : '#FBBF24'} strokeWidth="8" strokeLinecap="round" />
      <text x={scannerSvgX + 20} y="58" fill={missionOk ? '#A7F3D0' : '#FDE68A'} fontSize="12" fontWeight="900">TARAMA LAZERİ</text>
      <g
        data-testid="vertical-scanner-handle"
        role="slider"
        tabIndex={0}
        aria-label="Dikey tarayıcı"
        onPointerDown={onScannerDown}
        onKeyDown={(event) => handleScannerKey(event, onScannerStep, onScannerSnap)}
        style={{ cursor: 'ew-resize', touchAction: 'none' }}
      >
        <circle cx={scannerSvgX} cy="462" r="38" fill="transparent" />
        <circle cx={scannerSvgX} cy="462" r="24" fill="rgba(251,191,36,0.22)" stroke="#FBBF24" strokeWidth="4" />
        <circle cx={scannerSvgX} cy="462" r="9" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="3" />
      </g>
      <text x={scannerSvgX} y="502" textAnchor="middle" fill="#FDE68A" fontSize="15" fontWeight="900">x={formatValue(scannerX)}</text>
    </>
  );
}

function MappingBoard({
  mapping,
  selectedInput,
  onSelectInput,
  onSelectOutput,
}: {
  mapping: MappingState;
  selectedInput: number | null;
  onSelectInput: (input: number) => void;
  onSelectOutput: (output: number) => void;
}) {
  const inputPositions = mappingPairs.map((pair, index) => ({ value: pair.input, x: 130, y: 128 + index * 78 }));
  const outputPositions = outputPorts.map((value, index) => ({ value, x: 590, y: 128 + index * 78 }));

  return (
    <>
      <text x="76" y="82" fill="#BAE6FD" fontSize="16" fontWeight="900">f(x)=2x+1 port ağı</text>
      <text x="76" y="108" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="800">Girişe dokun, doğru çıkışa bağla.</text>
      {inputPositions.map((input) => {
        const mapped = mapping[input.value];
        const out = outputPositions.find((port) => port.value === mapped);
        return out ? (
          <motion.path
            key={`wire-${input.value}-${mapped}`}
            d={`M ${input.x + 54} ${input.y} C 286 ${input.y}, 426 ${out.y}, ${out.x - 54} ${out.y}`}
            fill="none"
            stroke={mapped === input.value * 2 + 1 ? '#34D399' : '#FB7185'}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.82"
            filter="url(#function-filter-glow)"
          />
        ) : null;
      })}

      {inputPositions.map((input) => (
        <PortButton
          key={`input-${input.value}`}
          testId={portTestId('mapping-port-in', input.value)}
          x={input.x}
          y={input.y}
          label={`x=${input.value}`}
          active={selectedInput === input.value}
          complete={mapping[input.value] !== null}
          onClick={() => onSelectInput(input.value)}
        />
      ))}
      {outputPositions.map((output) => (
        <PortButton
          key={`output-${output.value}`}
          testId={portTestId('mapping-port-out', output.value)}
          x={output.x}
          y={output.y}
          label={`y=${output.value}`}
          active={selectedInput !== null && mapping[selectedInput] === output.value}
          complete={Object.values(mapping).includes(output.value)}
          onClick={() => onSelectOutput(output.value)}
        />
      ))}
    </>
  );
}

function PortButton({ testId, x, y, label, active, complete, onClick }: { testId: string; x: number; y: number; label: string; active: boolean; complete: boolean; onClick: () => void }) {
  return (
    <g data-testid={testId} role="button" tabIndex={0} aria-label={label} onClick={onClick} onKeyDown={(event) => event.key === 'Enter' && onClick()} style={{ cursor: 'pointer' }}>
      <rect x={x - 54} y={y - 27} width="108" height="54" rx="18" fill={complete ? 'rgba(52,211,153,0.18)' : active ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.08)'} stroke={active ? '#FBBF24' : complete ? '#34D399' : 'rgba(255,255,255,0.28)'} strokeWidth="3" />
      <circle cx={x} cy={y} r="9" fill={complete ? '#34D399' : '#38BDF8'} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">{label}</text>
    </g>
  );
}

function handleScannerKey(event: ReactKeyboardEvent<SVGGElement>, onScannerStep: (delta: number) => void, onScannerSnap: () => void) {
  if (event.key === 'Home') {
    event.preventDefault();
    onScannerSnap();
    return;
  }
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  onScannerStep(event.key === 'ArrowRight' ? 0.2 : -0.2);
}

function completedMappings(mapping: MappingState) {
  return Object.values(mapping).filter((value) => value !== null).length;
}
