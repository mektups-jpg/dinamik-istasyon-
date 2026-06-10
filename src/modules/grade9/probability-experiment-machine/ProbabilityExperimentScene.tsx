import type { RefObject } from 'react';
import { motion } from 'motion/react';
import type {
  DragTarget,
  ProbabilityKeyboardHandler,
  ProbabilityMissionId,
  ProbabilityPointerDown,
  ProbabilityPointerMove,
  ProbabilityPointerUp,
} from './types';
import {
  OBSERVED_SUCCESS,
  OBSERVED_TOTAL,
  PROJECTION_SUCCESS,
  PROJECTION_TOTAL,
  SAMPLE_SUCCESS,
  SAMPLE_TOTAL,
  observedToX,
  projectionToX,
} from './probabilityExperimentModel';

interface ProbabilityExperimentSceneProps {
  missionId: ProbabilityMissionId;
  observedCount: number;
  projectionCount: number;
  observedLocked: boolean;
  projectionLocked: boolean;
  feedbackTone: 'idle' | 'error' | 'success';
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: ProbabilityPointerDown;
  onPointerMove: ProbabilityPointerMove;
  onPointerUp: ProbabilityPointerUp;
  onHandleKeyDown: ProbabilityKeyboardHandler;
}

export function ProbabilityExperimentScene({
  missionId,
  observedCount,
  projectionCount,
  observedLocked,
  projectionLocked,
  feedbackTone,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onHandleKeyDown,
}: ProbabilityExperimentSceneProps) {
  const isProjection = missionId === 'inductive-projection';
  const activeCount = isProjection ? projectionCount : observedCount;
  const activeTotal = isProjection ? PROJECTION_TOTAL : OBSERVED_TOTAL;
  const locked = isProjection ? projectionLocked : observedLocked;
  const toneColor = feedbackTone === 'error' ? '#FF4D8D' : locked ? '#00FF88' : '#00E5FF';

  return (
    <section
      data-testid="probability-experiment-machine-scene"
      className="relative min-w-0 overflow-hidden rounded-[34px] border border-cyan-200/18 bg-black/40 p-4 shadow-[0_0_58px_rgba(0,229,255,0.12)] xl:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(0,229,255,0.15),transparent_38%),radial-gradient(circle_at_18%_78%,rgba(0,255,136,0.10),transparent_30%)]" />
      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/55">MAT.9.7.1.1 / MAT.9.7.2.1</p>
          <h2 className="text-2xl font-black text-white">Deney Kayıtlarını Orana Çevir</h2>
        </div>
        <div className="rounded-2xl border border-cyan-200/22 bg-cyan-200/10 px-4 py-2 text-right font-mono">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/60">kurulan sayaç</p>
          <p className="text-lg font-black text-white">{activeCount}/{activeTotal}</p>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 520"
        className="relative h-[520px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020713]/80"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <filter id="probability-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="probability-rail" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        <rect x="54" y="58" width="612" height="396" rx="42" fill="rgba(255,255,255,0.025)" stroke="rgba(0,229,255,0.18)" />
        <MachineCore toneColor={toneColor} locked={locked} />

        {isProjection ? (
          <ProjectionStage
            projectionCount={projectionCount}
            projectionLocked={projectionLocked}
            feedbackTone={feedbackTone}
            onPointerDown={onPointerDown}
            onHandleKeyDown={onHandleKeyDown}
          />
        ) : (
          <ObservedStage
            observedCount={observedCount}
            observedLocked={observedLocked}
            feedbackTone={feedbackTone}
            onPointerDown={onPointerDown}
            onHandleKeyDown={onHandleKeyDown}
          />
        )}
      </svg>
    </section>
  );
}

function MachineCore({ toneColor, locked }: { toneColor: string; locked: boolean }) {
  return (
    <g>
      <motion.circle
        cx="360"
        cy="244"
        r="68"
        fill="rgba(0,229,255,0.06)"
        stroke={toneColor}
        strokeWidth="5"
        strokeDasharray="13 11"
        filter="url(#probability-glow)"
        animate={{ rotate: 360, opacity: [0.62, 1, 0.62] }}
        transition={{ rotate: { duration: 12, repeat: Infinity, ease: 'linear' }, opacity: { duration: 1.4, repeat: Infinity } }}
        style={{ transformOrigin: '360px 244px' }}
      />
      <circle cx="360" cy="244" r="43" fill="rgba(0,0,0,0.72)" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <text x="360" y="238" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="13" fontWeight="900">ORAN</text>
      <text x="360" y="262" textAnchor="middle" fill={locked ? '#00FF88' : '#fff'} fontSize="22" fontWeight="900">
        {locked ? 'kilitli' : 'merceği'}
      </text>
    </g>
  );
}

function ObservedStage({
  observedCount,
  observedLocked,
  feedbackTone,
  onPointerDown,
  onHandleKeyDown,
}: {
  observedCount: number;
  observedLocked: boolean;
  feedbackTone: 'idle' | 'error' | 'success';
  onPointerDown: ProbabilityPointerDown;
  onHandleKeyDown: ProbabilityKeyboardHandler;
}) {
  const handleX = observedToX(observedCount);
  const railColor = feedbackTone === 'error' ? '#FF4D8D' : observedLocked ? '#00FF88' : '#00E5FF';

  return (
    <g>
      <text x="360" y="104" textAnchor="middle" fill="#A5F3FC" fontSize="24" fontWeight="900">Son 100 Deney Kaydı</text>
      <TrialGrid total={OBSERVED_TOTAL} success={OBSERVED_SUCCESS} x={128} y={130} columns={25} />
      <line x1="114" y1="360" x2="606" y2="360" stroke="url(#probability-rail)" strokeWidth="16" strokeLinecap="round" />
      <line x1="114" y1="360" x2={handleX} y2="360" stroke={railColor} strokeWidth="16" strokeLinecap="round" filter="url(#probability-glow)" />
      <g
        data-testid="probability-experiment-machine-ratio-handle"
        tabIndex={0}
        aria-label="Gözlemsel oran kapağı"
        aria-keyshortcuts="Home ArrowLeft ArrowRight"
        onPointerDown={(event) => !observedLocked && onPointerDown(event, 'observed')}
        onKeyDown={(event) => onHandleKeyDown(event, 'observed')}
        style={{ cursor: observedLocked ? 'default' : 'grab', outline: 'none', touchAction: 'none' }}
      >
        <motion.circle
          cx={handleX}
          cy="360"
          r="34"
          fill={observedLocked ? 'rgba(0,255,136,0.18)' : 'rgba(0,229,255,0.18)'}
          stroke={railColor}
          strokeWidth="5"
          filter="url(#probability-glow)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <circle cx={handleX} cy="360" r="54" fill="transparent" />
        <text x={handleX} y="368" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">{observedCount}</text>
      </g>
      <text x="114" y="404" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="13" fontWeight="900">0</text>
      <text x="606" y="404" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="13" fontWeight="900">100</text>
      <text x="360" y="456" textAnchor="middle" fill={observedLocked ? '#00FF88' : 'rgba(255,255,255,0.68)'} fontSize="21" fontWeight="900">
        {observedLocked ? 'Gözlemsel olasılık kayıttan kuruldu' : 'Kapağı mavi kayıt sayısına hizala'}
      </text>
    </g>
  );
}

function ProjectionStage({
  projectionCount,
  projectionLocked,
  feedbackTone,
  onPointerDown,
  onHandleKeyDown,
}: {
  projectionCount: number;
  projectionLocked: boolean;
  feedbackTone: 'idle' | 'error' | 'success';
  onPointerDown: ProbabilityPointerDown;
  onHandleKeyDown: ProbabilityKeyboardHandler;
}) {
  const handleX = projectionToX(projectionCount);
  const railColor = feedbackTone === 'error' ? '#FF4D8D' : projectionLocked ? '#00FF88' : '#B388FF';

  return (
    <g>
      <text x="360" y="104" textAnchor="middle" fill="#DDD6FE" fontSize="24" fontWeight="900">Küçük Örneklemden Büyük Tahmin</text>
      <TrialGrid total={SAMPLE_TOTAL} success={SAMPLE_SUCCESS} x={207} y={130} columns={15} />
      <text x="360" y="226" textAnchor="middle" fill="rgba(255,255,255,0.70)" fontSize="16" fontWeight="900">
        30 küçük deneme aynı oranla 200 denemelik raya taşınıyor
      </text>
      <line x1="118" y1="360" x2="602" y2="360" stroke="rgba(179,136,255,0.18)" strokeWidth="20" strokeLinecap="round" />
      <line x1="118" y1="360" x2={handleX} y2="360" stroke={railColor} strokeWidth="20" strokeLinecap="round" filter="url(#probability-glow)" />
      <g
        data-testid="probability-experiment-machine-projection-handle"
        tabIndex={0}
        aria-label="Tümevarımsal tahmin kapağı"
        aria-keyshortcuts="Home ArrowLeft ArrowRight"
        onPointerDown={(event) => !projectionLocked && onPointerDown(event, 'projection')}
        onKeyDown={(event) => onHandleKeyDown(event, 'projection')}
        style={{ cursor: projectionLocked ? 'default' : 'grab', outline: 'none', touchAction: 'none' }}
      >
        <motion.rect
          x={handleX - 38}
          y="318"
          width="76"
          height="84"
          rx="24"
          fill={projectionLocked ? 'rgba(0,255,136,0.18)' : 'rgba(179,136,255,0.16)'}
          stroke={railColor}
          strokeWidth="5"
          filter="url(#probability-glow)"
          animate={{ y: [318, 312, 318] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <rect x={handleX - 56} y="302" width="112" height="116" rx="28" fill="transparent" />
        <text x={handleX} y="369" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">{projectionCount}</text>
      </g>
      <text x="118" y="406" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="13" fontWeight="900">0</text>
      <text x="602" y="406" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="13" fontWeight="900">200</text>
      <text x="360" y="456" textAnchor="middle" fill={projectionLocked ? '#00FF88' : 'rgba(255,255,255,0.68)'} fontSize="21" fontWeight="900">
        {projectionLocked ? 'Küçük oran büyük evrene taşındı' : 'Tahmin kapağını aynı oranın büyük karşılığına getir'}
      </text>
    </g>
  );
}

function TrialGrid({ total, success, x, y, columns }: { total: number; success: number; x: number; y: number; columns: number }) {
  return (
    <g>
      {Array.from({ length: total }, (_, index) => {
        const cx = x + (index % columns) * 19;
        const cy = y + Math.floor(index / columns) * 19;
        const active = index < success;
        return (
          <motion.circle
            key={index}
            cx={cx}
            cy={cy}
            r={active ? 6.5 : 5.5}
            fill={active ? '#00E5FF' : 'rgba(255,255,255,0.18)'}
            opacity={active ? 0.95 : 0.54}
            filter={active ? 'url(#probability-glow)' : undefined}
            animate={active ? { opacity: [0.65, 1, 0.65] } : undefined}
            transition={active ? { duration: 1.4, delay: (index % columns) * 0.02, repeat: Infinity } : undefined}
          />
        );
      })}
    </g>
  );
}
