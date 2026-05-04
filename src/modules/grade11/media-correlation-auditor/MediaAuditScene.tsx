import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { EvidencePoint, MediaAuditMeasure, MediaAuditState, MediaAuditTarget } from './types';
import { evidencePoints, evidenceToSvg, mediaAuditFrame, progressToX } from './mediaAuditModel';

interface MediaAuditSceneProps {
  state: MediaAuditState;
  target: MediaAuditTarget;
  measure: MediaAuditMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: 'lens' | 'conclusion', event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: 'lens' | 'conclusion', event: ReactKeyboardEvent<SVGGElement>) => void;
  onFlagWord: () => void;
}

export function MediaAuditScene({
  state,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onFlagWord,
}: MediaAuditSceneProps) {
  const lensX = progressToX(state.lensProgress, mediaAuditFrame.railX, mediaAuditFrame.railWidth);
  const sealX = progressToX(state.conclusionProgress, mediaAuditFrame.sealX, mediaAuditFrame.sealWidth);
  const showConclusion = target.kind === 'conclusion';

  return (
    <section
      data-testid="media-correlation-scene"
      className="relative overflow-hidden rounded-[32px] border border-emerald-100/16 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(52,211,153,0.16),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.13),transparent_30%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/58">makro atom: MAT.11.3.2</p>
          <h2 className="text-2xl font-black text-white">Medya Korelasyon Denetçisi</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-amber-300/25 bg-amber-300/10 text-amber-100'}`}>
          {target.label}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${mediaAuditFrame.width} ${mediaAuditFrame.height}`}
        className="relative h-[430px] w-full touch-none rounded-[28px] border border-white/12 bg-[#041018]/88 sm:h-[470px] xl:h-[560px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <filter id="media-audit-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="media-audit-grid" width="42" height="34" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={mediaAuditFrame.width} height={mediaAuditFrame.height} fill="rgba(2,6,23,0.32)" />
        <ClaimCard flagged={state.causationFlagged} onFlagWord={onFlagWord} />
        <EvidenceChart measure={measure} />

        <line x1={mediaAuditFrame.railX} y1={mediaAuditFrame.railY} x2={mediaAuditFrame.railX + mediaAuditFrame.railWidth} y2={mediaAuditFrame.railY} stroke="rgba(255,255,255,0.22)" strokeWidth="15" strokeLinecap="round" />
        <line x1={mediaAuditFrame.railX} y1={mediaAuditFrame.railY} x2={lensX} y2={mediaAuditFrame.railY} stroke="rgba(52,211,153,0.62)" strokeWidth="8" strokeLinecap="round" />
        <AuditHandle
          testId="audit-lens-handle"
          x={lensX}
          y={mediaAuditFrame.railY}
          color="#34D399"
          label={`Tarama ${Math.round(state.lensProgress * 100)}%`}
          ariaLabel="veri izi denetim merceği"
          value={Math.round(state.lensProgress * 100)}
          onPointerDown={(event) => onPointerDown('lens', event)}
          onKeyDown={(event) => onKeyDown('lens', event)}
        />

        {showConclusion && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <rect x="82" y="438" width="300" height="72" rx="24" fill="rgba(6,78,59,0.28)" stroke="rgba(110,231,183,0.28)" />
            <text x="232" y="466" textAnchor="middle" fill="#D1FAE5" fontSize="13" fontWeight="900">GÜVENLİ SONUÇ</text>
            <text x="232" y="491" textAnchor="middle" fill="rgba(255,255,255,0.76)" fontSize="12" fontWeight="800">İlişki var; tek başına neden kanıtı değil.</text>
            <line x1={mediaAuditFrame.sealX} y1={mediaAuditFrame.sealY} x2={mediaAuditFrame.sealX + mediaAuditFrame.sealWidth} y2={mediaAuditFrame.sealY} stroke="rgba(255,255,255,0.22)" strokeWidth="15" strokeLinecap="round" />
            <line x1={mediaAuditFrame.sealX} y1={mediaAuditFrame.sealY} x2={sealX} y2={mediaAuditFrame.sealY} stroke="rgba(251,191,36,0.62)" strokeWidth="8" strokeLinecap="round" />
            <AuditHandle
              testId="safe-conclusion-slider"
              x={sealX}
              y={mediaAuditFrame.sealY}
              color="#FBBF24"
              label={`Mühür ${Math.round(state.conclusionProgress * 100)}%`}
              ariaLabel="güvenli sonuç mührü"
              value={Math.round(state.conclusionProgress * 100)}
              onPointerDown={(event) => onPointerDown('conclusion', event)}
              onKeyDown={(event) => onKeyDown('conclusion', event)}
            />
          </motion.g>
        )}
      </svg>
    </section>
  );
}

function ClaimCard({ flagged, onFlagWord }: { flagged: boolean; onFlagWord: () => void }) {
  return (
    <g data-testid="claim-card">
      <rect x="70" y="88" width="292" height="250" rx="30" fill="rgba(15,23,42,0.74)" stroke="rgba(255,255,255,0.14)" />
      <text x="96" y="126" fill="#FDE68A" fontSize="13" fontWeight="900">MEDYA İDDİASI</text>
      <text x="96" y="168" fill="#fff" fontSize="20" fontWeight="900">Ekran süresi arttıkça</text>
      <text x="96" y="200" fill="#fff" fontSize="20" fontWeight="900">deneme başarısı</text>
      <g
        data-testid="causation-word-certain"
        role="button"
        tabIndex={0}
        aria-label="fazla güçlü nedensellik kelimesi"
        onClick={onFlagWord}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onFlagWord();
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect x="90" y="220" width="184" height="44" rx="16" fill={flagged ? 'rgba(248,113,113,0.28)' : 'rgba(251,191,36,0.18)'} stroke={flagged ? '#F87171' : '#FBBF24'} strokeWidth={flagged ? 2 : 3} />
        <text x="182" y="248" textAnchor="middle" fill={flagged ? '#FECACA' : '#FDE68A'} fontSize="18" fontWeight="900">kesin düşürür</text>
      </g>
      {flagged && (
        <text x="96" y="292" fill="#FECACA" fontSize="13" fontWeight="900">Kesinlik dili kanıtı aşar.</text>
      )}
      <text x="96" y="318" fill="rgba(255,255,255,0.88)" fontSize="13" fontWeight="900">Şüpheli ifade: sebep-sonuç dili</text>
    </g>
  );
}

function EvidenceChart({ measure }: { measure: MediaAuditMeasure }) {
  const first = evidenceToSvg({ id: 's', x: 1, y: 8.5 });
  const last = evidenceToSvg({ id: 'e', x: 9, y: 2.4 });

  return (
    <g data-testid="evidence-scatter">
      <rect x={mediaAuditFrame.chartX} y={mediaAuditFrame.chartY} width={mediaAuditFrame.chartWidth} height={mediaAuditFrame.chartHeight} rx="28" fill="url(#media-audit-grid)" stroke="rgba(255,255,255,0.14)" />
      <text
        x={mediaAuditFrame.chartX + mediaAuditFrame.chartWidth / 2}
        y={mediaAuditFrame.chartY + mediaAuditFrame.chartHeight + 28}
        textAnchor="middle"
        fill="rgba(255,255,255,0.78)"
        fontSize="13"
        fontWeight="900"
      >
        Ekran süresi
      </text>
      <text
        x={mediaAuditFrame.chartX - 28}
        y={mediaAuditFrame.chartY + mediaAuditFrame.chartHeight / 2}
        textAnchor="middle"
        transform={`rotate(-90 ${mediaAuditFrame.chartX - 28} ${mediaAuditFrame.chartY + mediaAuditFrame.chartHeight / 2})`}
        fill="rgba(255,255,255,0.78)"
        fontSize="13"
        fontWeight="900"
      >
        Deneme başarısı
      </text>
      <line x1={first.x} y1={first.y} x2={last.x} y2={last.y} stroke="rgba(244,114,182,0.68)" strokeWidth="16" strokeLinecap="round" filter="url(#media-audit-glow)" />
      {evidencePoints.map((point) => (
        <EvidenceDot key={point.id} point={point} />
      ))}
      <rect x="610" y="118" width="118" height="74" rx="22" fill="rgba(0,0,0,0.42)" stroke="rgba(255,255,255,0.16)" />
      <text x="669" y="146" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="11" fontWeight="900">VERİ YÖNÜ</text>
      <text x="669" y="174" textAnchor="middle" fill="#F9A8D4" fontSize="17" fontWeight="900">{measure.direction.toUpperCase()}</text>
    </g>
  );
}

function EvidenceDot({ point }: { point: EvidencePoint }) {
  const svgPoint = evidenceToSvg(point);
  return (
    <g>
      <circle cx={svgPoint.x} cy={svgPoint.y} r="16" fill="rgba(244,114,182,0.2)" stroke="#F9A8D4" strokeWidth="3" />
      <circle cx={svgPoint.x} cy={svgPoint.y} r="5" fill="#fff" />
    </g>
  );
}

function AuditHandle({ testId, x, y, color, label, ariaLabel, value, onPointerDown, onKeyDown }: {
  testId: string;
  x: number;
  y: number;
  color: string;
  label: string;
  ariaLabel: string;
  value: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid={testId}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      <title>{`${label}. Ok tuşlarıyla taşı, Home ile hedefe hizala.`}</title>
      <circle cx={x} cy={y} r="31" fill={`${color}22`} stroke={color} strokeWidth="3" filter="url(#media-audit-glow)" />
      <circle cx={x} cy={y} r="15" fill="#06111d" stroke={color} strokeWidth="5" />
      <text x={x} y={y + 48} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{label}</text>
    </g>
  );
}
