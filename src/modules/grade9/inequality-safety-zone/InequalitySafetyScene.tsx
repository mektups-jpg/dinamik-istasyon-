import type { RefObject } from 'react';
import { motion } from 'motion/react';
import {
  buildInequalityLabel,
  directionText,
  getBoundaryPoint,
  trackConfig,
  valueToX,
  zoneBounds,
} from './safetyZoneModel';
import { BoundaryKeyboardHandler, BoundaryPointerHandler, SafetyBuild, SafetyDirection, SafetyMission } from './types';

interface InequalitySafetySceneProps {
  mission: SafetyMission;
  build: SafetyBuild;
  matched: boolean;
  locked: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: BoundaryPointerHandler;
  onPointerMove: BoundaryPointerHandler;
  onPointerUp: () => void;
  onBoundaryKeyDown: BoundaryKeyboardHandler;
  onSelectDirection: (direction: SafetyDirection) => void;
}

export function InequalitySafetyScene({
  mission,
  build,
  matched,
  locked,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onBoundaryKeyDown,
  onSelectDirection,
}: InequalitySafetySceneProps) {
  const boundary = getBoundaryPoint(build);
  const zone = zoneBounds(build);
  const statusText = locked ? mission.resultLabel : matched ? 'test hazır' : build.direction ? `deneme ${buildInequalityLabel(build)}` : 'yön seçilmedi';
  const hasDirection = build.direction !== null;
  const selectionCaption = locked ? 'doğru seçim' : hasDirection ? 'deneme seçimi' : 'önce yön seç';
  const selectionValue = hasDirection ? buildInequalityLabel(build) : 'yön + sınır';
  const boundaryLabel = locked ? `sınır ${build.boundary}` : hasDirection ? `deneme sınırı ${build.boundary}` : 'sınırı sürükle';
  const boundaryInfoLabel = locked ? 'Sınır' : hasDirection ? 'Deneme sınırı' : 'Sınır';
  const boundaryInfoValue = locked || hasDirection ? `${build.boundary} ${mission.unit}` : 'sürükle ve yön seç';
  const regionText = build.direction === 'left'
    ? 'boyanan bölge: sınır ve solu'
    : build.direction === 'right'
      ? 'boyanan bölge: sınır ve sağı'
      : 'çözüm bölgesi için yön seç';

  return (
    <section
      data-testid="inequality-safety-zone-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-300/18 bg-black/35 p-4 shadow-[0_0_60px_rgba(0,229,255,0.10)] sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_42%,rgba(0,229,255,0.15),transparent_54%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">makro atom: {mission.atomId}</p>
          <h2 className="text-2xl font-black text-white">Çözüm Bölgesini Kur</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 text-sm font-black ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.05] text-white/70'}`}>
          {statusText}
        </div>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2">
          <DirectionButton
            testId="inequality-safety-zone-direction-left"
            active={build.direction === 'left'}
            label="x ≤ sınır"
            detail="en fazla / sol"
            onClick={() => onSelectDirection('left')}
          />
          <DirectionButton
            testId="inequality-safety-zone-direction-right"
            active={build.direction === 'right'}
            label="x ≥ sınır"
            detail="en az / sağ"
            onClick={() => onSelectDirection('right')}
          />
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 720 470"
          className="relative h-[470px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020611]/85"
          style={{ touchAction: 'none' }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <pattern id="inequality-safety-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            </pattern>
            <filter id="inequality-safety-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="inequality-safety-zone-gradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#00E5FF" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#B388FF" stopOpacity="0.62" />
            </linearGradient>
          </defs>

          <rect width="720" height="470" fill="url(#inequality-safety-grid)" />
          <rect x="54" y="58" width="300" height="96" rx="24" fill="rgba(0,0,0,0.44)" stroke="rgba(255,255,255,0.10)" />
          <text x="78" y="92" fill="#A5F3FC" fontSize="13" fontWeight="900">Günlük model</text>
          <text x="78" y="126" fill="#FFFFFF" fontSize="25" fontWeight="900">{mission.model}</text>
          <text x="78" y="146" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="800">x: {mission.unit} sayısı</text>

          <rect x="92" y="210" width="536" height="152" rx="42" fill="rgba(0,0,0,0.34)" stroke="rgba(0,229,255,0.10)" />
          <line x1={trackConfig.left} y1={trackConfig.y} x2={trackConfig.right} y2={trackConfig.y} stroke="rgba(255,255,255,0.30)" strokeWidth="5" strokeLinecap="round" />
          {hasDirection ? (
            <rect
              x={zone.x}
              y={trackConfig.y - 18}
              width={Math.max(zone.width, 1)}
              height="36"
              rx="18"
              fill="url(#inequality-safety-zone-gradient)"
              opacity="0.70"
              filter="url(#inequality-safety-glow)"
            />
          ) : null}

          {Array.from({ length: 11 }, (_, value) => {
            const x = valueToX(value);
            const active = build.direction === 'left' ? value <= build.boundary : build.direction === 'right' ? value >= build.boundary : false;
            return (
              <g key={value} className="pointer-events-none">
                <line x1={x} y1={trackConfig.y - 12} x2={x} y2={trackConfig.y + 12} stroke={active ? '#00FF88' : 'rgba(255,255,255,0.22)'} strokeWidth="2" />
                <text x={x} y={trackConfig.y + 38} textAnchor="middle" fill={active ? '#D1FAE5' : 'rgba(255,255,255,0.44)'} fontSize="13" fontWeight="900">{value}</text>
              </g>
            );
          })}

          <g className="pointer-events-none">
            <text x="360" y="198" textAnchor="middle" fill="rgba(255,255,255,0.70)" fontSize="13" fontWeight="900">
              {regionText}
            </text>
            <rect x="468" y="78" width="176" height="68" rx="22" fill="rgba(0,0,0,0.42)" stroke="rgba(0,229,255,0.16)" />
            <text x="556" y="105" textAnchor="middle" fill="#A5F3FC" fontSize="11" fontWeight="900">{selectionCaption}</text>
            <text x="556" y="132" textAnchor="middle" fill="#FFFFFF" fontSize="21" fontWeight="900">{selectionValue}</text>
            <rect x="214" y="382" width="292" height="50" rx="18" fill={locked ? 'rgba(0,255,136,0.12)' : 'rgba(0,229,255,0.08)'} stroke={locked ? '#00FF88' : 'rgba(0,229,255,0.22)'} />
            <text x="360" y="413" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">
              {locked ? `Çözüm bölgesi: ${mission.resultLabel}` : directionText(build.direction)}
            </text>
          </g>

          <g
            data-testid="inequality-safety-zone-boundary-handle"
            role="slider"
            tabIndex={0}
            aria-valuemin={trackConfig.min}
            aria-valuemax={trackConfig.max}
            aria-valuenow={build.boundary}
            aria-label="Eşitsizlik sınır işareti"
            aria-keyshortcuts="ArrowLeft ArrowRight Home"
            onPointerDown={onPointerDown}
            onKeyDown={onBoundaryKeyDown}
            style={{ cursor: 'grab', touchAction: 'none' }}
          >
            <circle cx={boundary.x} cy={boundary.y} r="44" fill="transparent" />
            <motion.line
              x1={boundary.x}
              y1={boundary.y - 94}
              x2={boundary.x}
              y2={boundary.y + 50}
              stroke={locked ? '#00FF88' : '#00E5FF'}
              strokeWidth="5"
              strokeLinecap="round"
              animate={{ opacity: matched ? [0.72, 1, 0.72] : 0.82 }}
              transition={{ duration: 0.8, repeat: matched ? Infinity : 0 }}
            />
            <circle
              cx={boundary.x}
              cy={boundary.y}
              r="28"
              fill={locked ? 'rgba(0,255,136,0.18)' : 'rgba(0,229,255,0.16)'}
              stroke={locked ? '#00FF88' : '#00E5FF'}
              strokeWidth="4"
            />
            <circle cx={boundary.x} cy={boundary.y} r="10" fill={hasDirection ? (locked ? '#00FF88' : '#A5F3FC') : '#FFFFFF'} stroke={locked ? '#00FF88' : '#00E5FF'} strokeWidth="4" />
            <text x={boundary.x} y={boundary.y - 108} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">
              {boundaryLabel}
            </text>
            {hasDirection ? (
              <text x={boundary.x} y={boundary.y + 74} textAnchor="middle" fill="#D1FAE5" fontSize="12" fontWeight="900">dolu nokta: sınır dahil</text>
            ) : null}
          </g>
        </svg>
      </div>

      <div className="relative mt-4 grid gap-3 md:grid-cols-3">
        <InfoTile label="Model" value={mission.model} />
        <InfoTile label={boundaryInfoLabel} value={boundaryInfoValue} />
        <InfoTile label="Alan" value={directionText(build.direction)} />
      </div>
    </section>
  );
}

function DirectionButton({ testId, active, label, detail, onClick }: { testId: string; active: boolean; label: string; detail: string; onClick: () => void }) {
  return (
    <motion.button
      data-testid={testId}
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`min-h-11 rounded-2xl border px-4 text-left text-xs font-black transition ${active ? 'border-emerald-300/40 bg-emerald-300/14 text-emerald-100' : 'border-white/10 bg-white/[0.06] text-white/65'}`}
    >
      <span className="block">{label}</span>
      <span className="block text-[10px] uppercase tracking-[0.18em] opacity-65">{detail}</span>
    </motion.button>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
