import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  hexagonPoints,
  mosaicFrame,
  mosaicTargets,
  pointsToString,
  progressToRailX,
  sealLabels,
  sealOptions,
  trianglePoints,
} from './mosaicModel';
import { MosaicDragTarget, MosaicSeal, MosaicWorkshopMeasure, MosaicWorkshopState, Point } from './types';

interface MosaicSceneProps {
  state: MosaicWorkshopState;
  activeIndex: number;
  measure: MosaicWorkshopMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (target: MosaicDragTarget, event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (target: MosaicDragTarget, event: ReactKeyboardEvent<SVGGElement>) => void;
  onSelectSeal: (seal: MosaicSeal) => void;
}

export function MosaicScene({
  state,
  activeIndex,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onSelectSeal,
}: MosaicSceneProps) {
  const target = mosaicTargets[activeIndex];
  const hexCenter = interpolatePoint({ x: 188, y: 382 }, { x: 450, y: 270 }, state.hexagonFit);
  const triCenter = interpolatePoint({ x: 712, y: 390 }, { x: 450, y: 270 }, state.triangleFit);
  const alarmActive = !missionOk && measure.gapLevel > 8;

  return (
    <section
      data-testid="mosaic-tiling-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_78%_22%,rgba(251,191,36,0.13),transparent_31%),radial-gradient(circle_at_55%_78%,rgba(167,139,250,0.12),transparent_34%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.11.2.5</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Mozaik Kaplama Masası</h2>
        </div>
        <div className={`w-full max-w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-left sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${mosaicFrame.width} ${mosaicFrame.height}`}
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="mosaic-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="mosaic-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="mosaic-surface" x1="0%" x2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.12)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.045)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.12)" />
          </linearGradient>
        </defs>

        <rect width={mosaicFrame.width} height={mosaicFrame.height} fill="url(#mosaic-grid)" />
        <rect x="70" y="56" width="760" height="596" rx="38" fill="url(#mosaic-surface)" stroke="rgba(255,255,255,0.13)" />
        <TilingBed activeIndex={activeIndex} hexagonFit={state.hexagonFit} triangleFit={state.triangleFit} rotationDial={state.rotationDial} />
        <GapAlarm active={alarmActive} measure={measure} />

        <TileHexagon center={hexCenter} active={activeIndex === 0} fit={state.hexagonFit} onPointerDown={(event) => onPointerDown('hexagon-tile', event)} onKeyDown={(event) => onKeyDown('hexagon-tile', event)} />
        <TileTriangle center={triCenter} active={activeIndex === 1} fit={state.triangleFit} rotation={measure.rotationDegrees} onPointerDown={(event) => onPointerDown('triangle-tile', event)} onKeyDown={(event) => onKeyDown('triangle-tile', event)} />
        <AngleRing scan={activeIndex === 1 ? Math.min(1, (state.triangleFit + state.rotationDial) / 2) : 0.2} total={measure.angleTotal} />

        <SealPads selectedSeal={state.selectedSeal} missionOk={missionOk} accent={target.accent} onSelectSeal={onSelectSeal} />

        <ControlRail
          testId="mosaic-rotation-dial"
          label={activeIndex === 2 ? 'hizalama rayı' : 'döndürme kadranı'}
          valueLabel={activeIndex === 2 ? `%${Math.round(state.rotationDial * 100)}` : `${measure.rotationDegrees}°`}
          y={mosaicFrame.railY}
          progress={state.rotationDial}
          color={activeIndex === 2 ? '#A78BFA' : '#FBBF24'}
          onPointerDown={(event) => onPointerDown('rotation-dial', event)}
          onKeyDown={(event) => onKeyDown('rotation-dial', event)}
        />
      </svg>
    </section>
  );
}

function TilingBed({ activeIndex, hexagonFit, triangleFit, rotationDial }: { activeIndex: number; hexagonFit: number; triangleFit: number; rotationDial: number }) {
  const center = { x: 450, y: 270 };
  const hexes = [
    { x: 450, y: 270 },
    { x: 548, y: 270 },
    { x: 352, y: 270 },
    { x: 499, y: 355 },
    { x: 401, y: 355 },
    { x: 499, y: 185 },
    { x: 401, y: 185 },
  ];
  const guideColor = activeIndex === 0 ? '#22D3EE' : activeIndex === 1 ? '#FBBF24' : '#A78BFA';
  const shift = activeIndex === 2 ? Math.round((1 - rotationDial) * 44) : 0;

  return (
    <g>
      <circle cx={center.x} cy={center.y} r="154" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" />
      {hexes.map((hex, index) => (
        <polygon
          key={`bed-hex-${index}`}
          points={pointsToString(hexagonPoints({ x: hex.x + shift, y: hex.y }, 49))}
          fill={index === 0 ? `${guideColor}18` : 'rgba(255,255,255,0.04)'}
          stroke={index === 0 ? guideColor : 'rgba(255,255,255,0.12)'}
          strokeWidth={index === 0 ? 2.5 : 1.5}
          strokeDasharray={index === 0 && hexagonFit < 0.85 ? '8 8' : undefined}
        />
      ))}
      <text x="450" y="476" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="13" fontWeight="900">
        {activeIndex === 0 ? 'altıgen yuva boşluk alarmını söndürür' : activeIndex === 1 ? 'köşe etrafı 360° kapanmalı' : 'desen rayı boşluksuz hizalanmalı'}
      </text>
      {activeIndex === 2 && (
        <motion.line
          x1="274"
          y1="452"
          x2={626 - shift}
          y2="452"
          stroke="#A78BFA"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#mosaic-glow)"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </g>
  );
}

function GapAlarm({ active, measure }: { active: boolean; measure: MosaicWorkshopMeasure }) {
  return (
    <g data-testid="mosaic-gap-alarm" transform="translate(604 90)">
      <rect width="188" height="120" rx="24" fill={active ? 'rgba(127,29,29,0.5)' : 'rgba(6,78,59,0.34)'} stroke={active ? '#FB7185' : '#6EE7B7'} strokeWidth="2" />
      <text x="20" y="32" fill="rgba(255,255,255,0.58)" fontSize="11" fontWeight="900">KAPLAMA ALARMI</text>
      <text x="20" y="70" fill={active ? '#FFE4E6' : '#D1FAE5'} fontSize="22" fontWeight="900">{measure.alarmLabel}</text>
      <text x="20" y="98" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="900">sapma: {measure.gapLevel}</text>
    </g>
  );
}

function TileHexagon({ center, active, fit, onPointerDown, onKeyDown }: {
  center: Point;
  active: boolean;
  fit: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="mosaic-tile-hexagon"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Altıgen fayans"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fit * 100)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
      opacity={active ? 1 : 0.56}
    >
      <polygon points={pointsToString(hexagonPoints(center, 48))} fill="rgba(34,211,238,0.24)" stroke="#22D3EE" strokeWidth="4" filter="url(#mosaic-glow)" />
      {(active || fit < 0.75) && (
        <text x={center.x} y={center.y + 6} textAnchor="middle" fill="#E0F2FE" fontSize="15" fontWeight="900">ALTIGEN</text>
      )}
    </g>
  );
}

function TileTriangle({ center, active, fit, rotation, onPointerDown, onKeyDown }: {
  center: Point;
  active: boolean;
  fit: number;
  rotation: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="mosaic-tile-triangle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Üçgen fayans"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fit * 100)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
      opacity={active ? 1 : 0.52}
    >
      <polygon points={pointsToString(trianglePoints(center, 58, -90 + rotation))} fill="rgba(251,191,36,0.24)" stroke="#FBBF24" strokeWidth="4" filter="url(#mosaic-glow)" />
      {(active || fit < 0.75) && (
        <text x={center.x} y={center.y + 7} textAnchor="middle" fill="#FEF3C7" fontSize="14" fontWeight="900">ÜÇGEN</text>
      )}
    </g>
  );
}

function AngleRing({ scan, total }: { scan: number; total: number }) {
  const center = { x: 450, y: 270 };
  const radius = 106;
  const sweep = Math.max(1, Math.min(359.8, scan * 360));
  return (
    <g opacity={scan > 0.24 ? 1 : 0.42}>
      <path d={arcPath(center, radius, -90, -90 + sweep)} fill="none" stroke="#FBBF24" strokeWidth="11" strokeLinecap="round" opacity="0.78" />
      <circle cx={center.x} cy={center.y} r="54" fill="rgba(0,0,0,0.26)" stroke="rgba(255,255,255,0.12)" />
      <text x={center.x} y={center.y + 7} textAnchor="middle" fill="#FDE68A" fontSize="24" fontWeight="900">{total}°</text>
    </g>
  );
}

function SealPads({ selectedSeal, missionOk, accent, onSelectSeal }: { selectedSeal: MosaicSeal | null; missionOk: boolean; accent: string; onSelectSeal: (seal: MosaicSeal) => void }) {
  return (
    <g transform="translate(262 500)">
      {sealOptions.map((seal, index) => {
        const selected = selectedSeal === seal;
        const stroke = missionOk && selected ? '#6EE7B7' : selected ? accent : 'rgba(255,255,255,0.28)';
        return (
          <g
            key={seal}
            data-testid={`mosaic-seal-${seal}`}
            role="button"
            tabIndex={0}
            focusable="true"
            transform={`translate(${index * 126} 0)`}
            onClick={() => onSelectSeal(seal)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectSeal(seal);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <rect width="108" height="66" rx="18" fill={selected ? `${accent}26` : 'rgba(255,255,255,0.055)'} stroke={stroke} strokeWidth={selected ? 3 : 1.5} />
            <text x="54" y="24" textAnchor="middle" fill={selected ? '#fff' : 'rgba(255,255,255,0.46)'} fontSize="9" fontWeight="900" letterSpacing="2">MÜHÜR</text>
            <text x="54" y="46" textAnchor="middle" fill={selected ? '#fff' : 'rgba(255,255,255,0.72)'} fontSize="14" fontWeight="900">{sealLabels[seal]}</text>
            {selected && <circle cx="94" cy="14" r="6" fill={missionOk ? '#6EE7B7' : accent} />}
          </g>
        );
      })}
    </g>
  );
}

function ControlRail({ testId, label, valueLabel, y, progress, color, onPointerDown, onKeyDown }: {
  testId: string;
  label: string;
  valueLabel: string;
  y: number;
  progress: number;
  color: string;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  const x = progressToRailX(progress);
  return (
    <g>
      <text x={mosaicFrame.railX - 18} y={y + 5} textAnchor="end" fill="rgba(255,255,255,0.64)" fontSize="12" fontWeight="900">{label}</text>
      <text x={mosaicFrame.railX + mosaicFrame.railWidth + 18} y={y + 5} fill={color} fontSize="12" fontWeight="900">{valueLabel}</text>
      <line
        x1={mosaicFrame.railX}
        y1={y}
        x2={mosaicFrame.railX + mosaicFrame.railWidth}
        y2={y}
        stroke="transparent"
        strokeWidth="42"
        strokeLinecap="round"
        onPointerDown={onPointerDown}
        style={{ cursor: 'grab' }}
      />
      <line x1={mosaicFrame.railX} y1={y} x2={mosaicFrame.railX + mosaicFrame.railWidth} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="14" strokeLinecap="round" />
      <line x1={mosaicFrame.railX} y1={y} x2={x} y2={y} stroke={color} strokeWidth="6" strokeLinecap="round" />
      <g
        data-testid={testId}
        role="slider"
        tabIndex={0}
        focusable="true"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        transform={`translate(${x} ${y})`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ cursor: 'grab' }}
      >
        <circle r="28" fill="transparent" />
        <circle r="20" fill="#07111c" stroke={color} strokeWidth="4" filter="url(#mosaic-glow)" />
        <circle r="6" fill="#fff" />
      </g>
    </g>
  );
}

function interpolatePoint(from: Point, to: Point, progress: number): Point {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

function polarPoint(center: Point, radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius,
  };
}

function arcPath(center: Point, radius: number, startAngle: number, endAngle: number) {
  const start = polarPoint(center, radius, startAngle);
  const end = polarPoint(center, radius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
