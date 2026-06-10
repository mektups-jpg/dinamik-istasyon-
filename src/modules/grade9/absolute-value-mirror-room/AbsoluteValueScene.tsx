import type { RefObject } from 'react';
import { motion } from 'motion/react';
import { AbsoluteBuild, AbsoluteMission, VertexKeyboardHandler, VertexPointerHandler } from './types';
import {
  createFunctionPath,
  createRayPath,
  formatSigned,
  getVertexPoint,
  graphConfig,
  graphToSvg,
  slopeLabel,
} from './absoluteValueModel';

interface AbsoluteValueSceneProps {
  mission: AbsoluteMission;
  build: AbsoluteBuild;
  matched: boolean;
  locked: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: VertexPointerHandler;
  onPointerMove: VertexPointerHandler;
  onPointerUp: () => void;
  onVertexKeyDown: VertexKeyboardHandler;
  onToggleFold: () => void;
  onToggleSlope: () => void;
}

export function AbsoluteValueScene(props: AbsoluteValueSceneProps) {
  const {
    mission,
    build,
    matched,
    locked,
    svgRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onVertexKeyDown,
    onToggleFold,
    onToggleSlope,
  } = props;
  const vertex = getVertexPoint(build);
  const targetVertex = getVertexPoint(mission.target);
  const xAxisStart = graphToSvg({ x: graphConfig.minX, y: 0 });
  const xAxisEnd = graphToSvg({ x: graphConfig.maxX, y: 0 });
  const yAxisStart = graphToSvg({ x: 0, y: -3 });
  const yAxisEnd = graphToSvg({ x: 0, y: 5.8 });
  const statusText = locked ? mission.resultLabel : matched ? 'mühür hazır' : `tepe adayı x=${formatSigned(build.vertexX)}`;
  const targetGuideLabelX = Math.min(560, Math.max(160, targetVertex.x + 96));
  const targetGuideLabelY = Math.max(92, targetVertex.y - 112);
  const targetVertexLabelX = Math.min(520, Math.max(120, targetVertex.x - 78));
  const targetVertexLabelY = targetVertex.y + 54;

  return (
    <section
      data-testid="absolute-value-mirror-room-scene"
      className="relative overflow-hidden rounded-[32px] border border-cyan-300/18 bg-black/35 p-4 shadow-[0_0_60px_rgba(0,229,255,0.11)] sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_38%,rgba(0,229,255,0.15),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/55">makro atom: {mission.atomId}</p>
          <h2 className="text-2xl font-black text-white">Tepe Noktasını Ayarla</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 text-sm font-black ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.05] text-white/70'}`}>
          {statusText}
        </div>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2">
          <motion.button
            data-testid="absolute-value-mirror-room-fold-toggle"
            type="button"
            onClick={onToggleFold}
            whileTap={{ scale: 0.96 }}
            className={`min-h-11 rounded-2xl border px-4 text-xs font-black transition ${build.folded ? 'border-emerald-300/40 bg-emerald-300/14 text-emerald-100' : 'border-pink-300/35 bg-pink-300/10 text-pink-100'}`}
          >
            {build.folded ? 'Katlama açık' : 'Negatif kolu katla'}
          </motion.button>
          <motion.button
            data-testid="absolute-value-mirror-room-slope-toggle"
            type="button"
            onClick={onToggleSlope}
            whileTap={{ scale: 0.96 }}
            className={`min-h-11 rounded-2xl border px-4 text-xs font-black transition ${build.slope === 2 ? 'border-amber-300/40 bg-amber-300/14 text-amber-100' : 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100'}`}
          >
            {build.slope === 2 ? 'Eğim 2 açık' : 'Eğimi 2 yap'}
          </motion.button>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 720 500"
          className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020611]/85"
          style={{ touchAction: 'none' }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <pattern id="absolute-mirror-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            </pattern>
            <filter id="absolute-mirror-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="absolute-mirror-folded" x1="0" x2="1">
              <stop offset="0%" stopColor="#00FF88" />
              <stop offset="52%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#B388FF" />
            </linearGradient>
          </defs>
          <rect width="720" height="500" fill="url(#absolute-mirror-grid)" />
          <line x1={xAxisStart.x} y1={xAxisStart.y} x2={xAxisEnd.x} y2={xAxisEnd.y} stroke="rgba(255,255,255,0.36)" strokeWidth="2" />
          <line x1={yAxisStart.x} y1={yAxisStart.y} x2={yAxisEnd.x} y2={yAxisEnd.y} stroke="rgba(255,255,255,0.24)" strokeWidth="2" />
          <line x1={xAxisStart.x} y1={xAxisStart.y} x2={xAxisEnd.x} y2={xAxisEnd.y} stroke="#00E5FF" strokeWidth="8" opacity="0.12" />
          <text x="660" y={xAxisStart.y + 26} fill="rgba(255,255,255,0.54)" fontSize="14" fontWeight="900">x</text>
          <text x={yAxisStart.x + 16} y="58" fill="rgba(255,255,255,0.54)" fontSize="14" fontWeight="900">y</text>

          {[-4, -2, 0, 2, 4].map((tick) => {
            const point = graphToSvg({ x: tick, y: 0 });
            return (
              <g key={tick} className="pointer-events-none">
                <line x1={point.x} y1={point.y - 7} x2={point.x} y2={point.y + 7} stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
                <text x={point.x} y={point.y + 28} textAnchor="middle" fill="rgba(255,255,255,0.50)" fontSize="13" fontWeight="900">{formatSigned(tick)}</text>
              </g>
            );
          })}

          <polyline
            points={createFunctionPath(mission.target, true)}
            fill="none"
            stroke="#FBBF24"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 13"
            opacity="0.48"
          />
          <circle cx={targetVertex.x} cy={targetVertex.y} r="22" fill="rgba(251,191,36,0.05)" stroke="#FBBF24" strokeWidth="3" strokeDasharray="7 8" opacity="0.82" />
          <g className="pointer-events-none">
            <rect
              x={targetGuideLabelX - 68}
              y={targetGuideLabelY - 22}
              width="136"
              height="34"
              rx="17"
              fill="rgba(251,191,36,0.14)"
              stroke="rgba(251,191,36,0.58)"
            />
            <text x={targetGuideLabelX} y={targetGuideLabelY} textAnchor="middle" fill="#FDE68A" fontSize="13" fontWeight="900">hedef grafik</text>
            <rect x={targetVertexLabelX - 54} y={targetVertexLabelY - 20} width="108" height="30" rx="15" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.45)" />
            <text x={targetVertexLabelX} y={targetVertexLabelY} textAnchor="middle" fill="#FDE68A" fontSize="12" fontWeight="900">hedef tepe</text>
          </g>

          {build.folded ? (
            <polyline
              points={createRayPath(build, 'left', false)}
              fill="none"
              stroke="#FF4FA3"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 12"
              opacity="0.26"
            />
          ) : null}
          <polyline
            points={build.folded ? createFunctionPath(build, true) : createRayPath(build, 'right', false)}
            fill="none"
            stroke={build.folded ? 'url(#absolute-mirror-folded)' : '#00E5FF'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#absolute-mirror-glow)"
            opacity="0.94"
          />
          {!build.folded ? (
            <polyline
              points={createRayPath(build, 'left', false)}
              fill="none"
              stroke="#FF4FA3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#absolute-mirror-glow)"
              opacity="0.86"
            />
          ) : null}

          <g className="pointer-events-none">
            <rect x="54" y="54" width="250" height="86" rx="22" fill="rgba(0,0,0,0.44)" stroke="rgba(255,255,255,0.10)" />
            <text x="76" y="88" fill="#A5F3FC" fontSize="14" fontWeight="900">Aktif ifade</text>
            <text x="76" y="118" fill="#FFFFFF" fontSize="22" fontWeight="900">{mission.expression}</text>
            <rect x="470" y="386" width="184" height="58" rx="20" fill="rgba(0,0,0,0.38)" stroke="rgba(0,229,255,0.18)" />
            <text x="562" y="411" textAnchor="middle" fill="#A5F3FC" fontSize="12" fontWeight="900">ayna durumu</text>
            <text x="562" y="433" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">{build.folded ? 'negatif kol yukarıda' : 'negatif kol altta'}</text>
          </g>

          <g
            data-testid="absolute-value-mirror-room-vertex-handle"
            role="slider"
            tabIndex={0}
            aria-valuemin={graphConfig.minX + 1}
            aria-valuemax={graphConfig.maxX - 1}
            aria-valuenow={build.vertexX}
            aria-label="Mutlak değer tepe noktası"
            aria-keyshortcuts="ArrowLeft ArrowRight Home"
            onPointerDown={onPointerDown}
            onKeyDown={onVertexKeyDown}
            style={{ cursor: 'grab', touchAction: 'none' }}
          >
            <circle cx={vertex.x} cy={vertex.y} r="42" fill="transparent" />
            <motion.circle
              cx={vertex.x}
              cy={vertex.y}
              r="28"
              fill={locked ? 'rgba(0,255,136,0.18)' : 'rgba(0,229,255,0.16)'}
              stroke={locked ? '#00FF88' : '#00E5FF'}
              strokeWidth="4"
              animate={{ r: matched ? [28, 32, 28] : 28 }}
              transition={{ duration: 0.85, repeat: matched ? Infinity : 0 }}
            />
            <circle cx={vertex.x} cy={vertex.y} r="10" fill="#FFFFFF" stroke={locked ? '#00FF88' : '#00E5FF'} strokeWidth="4" />
            <text x={vertex.x} y={vertex.y - 38} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">tepe</text>
          </g>
        </svg>
      </div>

      <div className="relative mt-4 grid gap-3 md:grid-cols-3">
        <InfoTile label="İfade" value={mission.expression} />
        <InfoTile label="Tepe adayı" value={`x=${formatSigned(build.vertexX)}`} />
        <InfoTile label="Hedef diklik" value={slopeLabel(mission.target.slope)} />
      </div>
    </section>
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
