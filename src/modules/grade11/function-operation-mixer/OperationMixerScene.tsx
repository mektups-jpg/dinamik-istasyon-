import type { RefObject } from 'react';
import { motion } from 'motion/react';
import { OperationKeyboardHandler, OperationKind, OperationMeasure, OperationState, OperationTarget, OutputValue, ValuePoint } from './types';
import { operationFrame, operationMeta, operationOrder, operationPoints } from './operationMixerModel';

interface OperationMixerSceneProps {
  state: OperationState;
  target: OperationTarget;
  measure: OperationMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onSelectOperation: (operation: OperationKind) => void;
  onDialKeyDown: OperationKeyboardHandler;
}

const rowY = [172, 260, 348];

const dialPositions: Record<OperationKind, { x: number; y: number }> = {
  add: { x: 450, y: 134 },
  subtract: { x: 336, y: 250 },
  multiply: { x: 564, y: 250 },
  divide: { x: 450, y: 366 },
};

export function OperationMixerScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onSelectOperation,
  onDialKeyDown,
}: OperationMixerSceneProps) {
  const activeMeta = state.selected ? operationMeta[state.selected] : operationMeta[target.operation];

  return (
    <section
      data-testid="function-operation-mixer-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_26px_84px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(244,114,182,0.15),transparent_34%),radial-gradient(circle_at_72%_84%,rgba(52,211,153,0.14),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">fonksiyon işlem tezgahı</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Fonksiyon İşlem Mikseri</h2>
        </div>
        <div className={`min-w-0 max-w-full basis-full rounded-2xl border px-4 py-2 text-left font-mono text-xs font-black leading-relaxed sm:basis-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/14 bg-black/28 text-white/82'}`}>
          {measure.nextAction}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${operationFrame.width} ${operationFrame.height}`}
        className="relative h-[390px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041120]/90 sm:h-[430px] xl:h-[500px]"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <pattern id="operation-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
          <filter id="operation-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="operation-output-fill" x1="0" x2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="48%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        <rect width={operationFrame.width} height={operationFrame.height} fill="url(#operation-grid)" />
        <rect x="40" y="54" width="820" height="408" rx="34" fill="rgba(0,0,0,0.23)" stroke="rgba(255,255,255,0.10)" />

        <FunctionStreams />
        <MixerDial
          selected={state.selected}
          target={target}
          activeMeta={activeMeta}
          onSelectOperation={onSelectOperation}
          onDialKeyDown={onDialKeyDown}
        />
        <OutputRail outputs={measure.outputs} selected={state.selected} activeMeta={activeMeta} />
        <FormulaBand measure={measure} missionOk={missionOk} />
      </svg>
    </section>
  );
}

function FunctionStreams() {
  return (
    <g>
      <g data-testid="function-operation-f-stream" pointerEvents="none">
        <text x="92" y="96" fill="#22D3EE" fontSize="20" fontWeight="950">f(x)=x+3</text>
        {operationPoints.map((point, index) => (
          <ValueCapsule key={`f-${point.x}`} x={130} y={rowY[index] - 22} label={`f(${point.x})=${point.f}`} color="#22D3EE" />
        ))}
      </g>
      <g data-testid="function-operation-g-stream" pointerEvents="none">
        <text x="244" y="96" fill="#A78BFA" fontSize="20" fontWeight="950">g(x)=x-2</text>
        {operationPoints.map((point, index) => (
          <ValueCapsule key={`g-${point.x}`} x={130} y={rowY[index] + 24} label={`g(${point.x})=${point.g}`} color="#A78BFA" />
        ))}
      </g>
      {operationPoints.map((point, index) => (
        <g key={`lane-${point.x}`} pointerEvents="none">
          <text x="68" y={rowY[index] + 6} fill="rgba(255,255,255,0.55)" fontSize="14" fontWeight="950">x={point.x}</text>
          <path d={`M 230 ${rowY[index] - 22} C 284 ${rowY[index] - 26}, 302 ${rowY[index] - 12}, 342 ${rowY[index]}`} fill="none" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" opacity="0.56" />
          <path d={`M 230 ${rowY[index] + 24} C 284 ${rowY[index] + 28}, 302 ${rowY[index] + 12}, 342 ${rowY[index]}`} fill="none" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" opacity="0.52" />
        </g>
      ))}
    </g>
  );
}

function MixerDial({
  selected,
  target,
  activeMeta,
  onSelectOperation,
  onDialKeyDown,
}: {
  selected: OperationKind | null;
  target: OperationTarget;
  activeMeta: { color: string; glow: string };
  onSelectOperation: (operation: OperationKind) => void;
  onDialKeyDown: OperationKeyboardHandler;
}) {
  return (
    <g
      data-testid="function-operation-dial"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="işlem kadranı"
      aria-roledescription="fonksiyon işlem kapısı seçici"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={selected ? 100 : 0}
      aria-valuetext={selected ? `${operationMeta[selected].label} seçildi` : `${operationMeta[target.operation].label} kapısı bekleniyor`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onKeyDown={onDialKeyDown}
      style={{ outline: 'none' }}
    >
      <title>Home ile hedef işlem kapısını seç. Ok tuşlarıyla işlem kapıları arasında gez.</title>
      <circle cx={operationFrame.dial.x} cy={operationFrame.dial.y} r="116" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.16)" strokeWidth="3" />
      <motion.circle
        cx={operationFrame.dial.x}
        cy={operationFrame.dial.y}
        r="62"
        fill={activeMeta.color}
        opacity="0.10"
        filter="url(#operation-glow)"
        animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 1.3, repeat: Infinity }}
      />
      <text x={operationFrame.dial.x} y={operationFrame.dial.y - 8} textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="950">işlem</text>
      <text x={operationFrame.dial.x} y={operationFrame.dial.y + 28} textAnchor="middle" fill="#fff" fontSize="38" fontWeight="950">{selected ? operationMeta[selected].symbol : '?'}</text>
      {operationOrder.map((operation) => (
        <OperationButton
          key={operation}
          operation={operation}
          active={selected === operation}
          target={target.operation === operation}
          onSelectOperation={onSelectOperation}
        />
      ))}
    </g>
  );
}

function OperationButton({
  operation,
  active,
  target,
  onSelectOperation,
}: {
  operation: OperationKind;
  active: boolean;
  target: boolean;
  onSelectOperation: (operation: OperationKind) => void;
}) {
  const meta = operationMeta[operation];
  const position = dialPositions[operation];
  return (
    <g
      data-testid={`function-operation-dial-${operation}`}
      role="button"
      tabIndex={0}
      focusable="true"
      aria-label={`${meta.label} kapısı`}
      onPointerDown={() => onSelectOperation(operation)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectOperation(operation);
        }
      }}
      style={{ cursor: 'pointer', touchAction: 'none' }}
    >
      <circle cx={position.x} cy={position.y} r="39" fill={active ? `${meta.color}34` : target ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.065)'} stroke={active ? meta.color : target ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.18)'} strokeWidth={active ? 4 : 2} filter={active ? 'url(#operation-glow)' : undefined} />
      <text x={position.x} y={position.y + 12} textAnchor="middle" fill={active ? '#fff' : meta.color} fontSize="34" fontWeight="950">{meta.symbol}</text>
      {target ? <circle cx={position.x + 28} cy={position.y - 28} r="8" fill="#FDE68A" /> : null}
    </g>
  );
}

function OutputRail({ outputs, selected, activeMeta }: { outputs: OutputValue[]; selected: OperationKind | null; activeMeta: { color: string } }) {
  return (
    <g data-testid="function-operation-output" pointerEvents="none">
      <text x={operationFrame.outputX - 4} y="104" fill="rgba(255,255,255,0.68)" fontSize="16" fontWeight="950">çıktı rayı</text>
      <rect x={operationFrame.outputX - 54} y="126" width="150" height="266" rx="30" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.13)" />
      {outputs.map((output, index) => (
        <OutputCapsule key={`output-${output.x}`} output={output} y={rowY[index]} selected={selected} color={activeMeta.color} />
      ))}
    </g>
  );
}

function OutputCapsule({ output, y, selected, color }: { output: OutputValue; y: number; selected: OperationKind | null; color: string }) {
  const fill = output.blocked ? 'rgba(244,63,94,0.18)' : selected ? `${color}24` : 'rgba(255,255,255,0.06)';
  const stroke = output.blocked ? '#FB7185' : selected ? color : 'rgba(255,255,255,0.16)';
  return (
    <g>
      <path d={`M 558 ${y} C 600 ${y}, 618 ${y}, 636 ${y}`} fill="none" stroke={output.blocked ? '#FB7185' : selected ? 'url(#operation-output-fill)' : 'rgba(255,255,255,0.16)'} strokeWidth="7" strokeLinecap="round" strokeDasharray={selected ? '0' : '9 11'} opacity={output.blocked ? 0.82 : 0.74} />
      <rect x={operationFrame.outputX - 22} y={y - 25} width="94" height="50" rx="25" fill={fill} stroke={stroke} strokeWidth="3" />
      <text x={operationFrame.outputX + 25} y={y - 6} textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="11" fontWeight="950">x={output.x}</text>
      <text x={operationFrame.outputX + 25} y={y + 15} textAnchor="middle" fill={output.blocked ? '#FECACA' : '#fff'} fontSize="18" fontWeight="950">{output.resultLabel}</text>
      {output.blocked ? <text x={operationFrame.outputX + 82} y={y + 6} fill="#FB7185" fontSize="20" fontWeight="950">×</text> : null}
    </g>
  );
}

function FormulaBand({ measure, missionOk }: { measure: OperationMeasure; missionOk: boolean }) {
  return (
    <g pointerEvents="none">
      <rect x="122" y="414" width="656" height="70" rx="26" fill={missionOk ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.072)'} stroke={missionOk ? 'rgba(52,211,153,0.55)' : 'rgba(255,255,255,0.16)'} />
      <text x="450" y="443" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="13" fontWeight="950">işlem okuması</text>
      <text x="450" y="472" textAnchor="middle" fill={missionOk ? '#C8FDDC' : '#fff'} fontSize="25" fontWeight="950">{measure.formulaLabel}</text>
    </g>
  );
}

function ValueCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 66} y={y - 22} width="132" height="44" rx="22" fill={`${color}20`} stroke={color} strokeWidth="3" />
      <text x={x} y={y + 7} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="950">{label}</text>
    </g>
  );
}
