import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import {
  cosineStationC,
  sineStationB,
  sineStationC,
  sineVisorPoint,
  terrainFrame,
  terrainTargets,
} from './terrainSurveyorModel';
import { TerrainMeasure, TerrainMissionTarget, TerrainState } from './types';

interface TerrainSurveyorSceneProps {
  state: TerrainState;
  activeIndex: number;
  target: TerrainMissionTarget;
  measure: TerrainMeasure;
  missionOk: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

export function TerrainSurveyorScene({
  state,
  activeIndex,
  target,
  measure,
  missionOk,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: TerrainSurveyorSceneProps) {
  const isCosine = target.lock === 'cosine';
  const isSine = target.lock === 'sine';

  return (
    <section
      data-testid="terrain-surveyor-scene"
      className="relative overflow-hidden rounded-[32px] border border-white/14 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(34,211,238,0.17),transparent_32%),radial-gradient(circle_at_76%_18%,rgba(167,139,250,0.13),transparent_32%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/58">makro atom: MAT.10.4.4</p>
          <h2 className="text-xl font-black text-white sm:text-2xl">Sinüs-Kosinüs Arazi Ölçeri</h2>
        </div>
        <div className={`w-full rounded-2xl border px-4 py-2 text-center font-mono text-xs font-black sm:w-auto sm:text-sm ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-white/15 bg-black/28 text-white'}`}>
          {target.title}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${terrainFrame.width} ${terrainFrame.height}`}
        className="relative h-[360px] w-full touch-none rounded-[28px] border border-white/12 bg-[#061018]/92 sm:h-[560px] xl:h-[650px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="terrain-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.052)" strokeWidth="1" />
          </pattern>
          <filter id="terrain-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={terrainFrame.width} height={terrainFrame.height} fill="url(#terrain-grid)" />
        <rect x="60" y="52" width="780" height="560" rx="38" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.13)" />
        {isCosine && <CosineTerrain state={state} target={target} measure={measure} missionOk={missionOk} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />}
        {isSine && <SineTerrain state={state} target={target} measure={measure} missionOk={missionOk} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />}
        {target.lock === 'report' && <ReportTerrain state={state} target={target} measure={measure} missionOk={missionOk} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />}
        <FormulaReadout activeIndex={activeIndex} measure={measure} missionOk={missionOk} />
      </svg>
    </section>
  );
}

function CosineTerrain({ state, target, measure, missionOk, onPointerDown, onKeyDown }: TerrainLayerProps) {
  const stationA = terrainFrame.cosineA;
  const stationB = terrainFrame.cosineB;
  const stationC = cosineStationC(state.cursorProgress);
  const targetC = cosineStationC(target.targetProgress);

  return (
    <g>
      <text x="450" y="126" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="15" fontWeight="900">
        iki kenar + aradaki açı biliniyorsa eksik kenar kosinüsle ölçülür
      </text>
      <polygon
        points={`${stationA.x},${stationA.y} ${stationB.x},${stationB.y} ${stationC.x},${stationC.y}`}
        fill={missionOk ? 'rgba(110,231,183,0.18)' : 'rgba(34,211,238,0.13)'}
        stroke={missionOk ? '#6EE7B7' : '#E0F2FE'}
        strokeWidth="5"
        strokeLinejoin="round"
        filter="url(#terrain-glow)"
      />
      <line x1={stationB.x} y1={stationB.y} x2={stationC.x} y2={stationC.y} stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" opacity="0.82" />
      <Arc cx={stationA.x} cy={stationA.y} radius={82} endAngle={measure.angleA} color="#22D3EE" label={`A=${measure.angleA.toFixed(0)}°`} />
      <TargetRing testId="terrain-cosine-target" x={targetC.x} y={targetC.y} active color={target.accent} label="kosinüs hedefi" />
      <Station testId="terrain-station-a" x={stationA.x} y={stationA.y} label="A" color="#22D3EE" />
      <Station testId="terrain-station-b" x={stationB.x} y={stationB.y} label="B" color="#FBBF24" />
      <SurveyHandle stationTestId="terrain-station-c" x={stationC.x} y={stationC.y} label="C" color={target.accent} progress={state.cursorProgress} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      <text x={(stationA.x + stationB.x) / 2} y={stationA.y + 42} textAnchor="middle" fill="#BAE6FD" fontSize="14" fontWeight="950">AB = {measure.sideAB} br</text>
      <text x={(stationA.x + stationC.x) / 2 - 16} y={(stationA.y + stationC.y) / 2 - 18} textAnchor="middle" fill="#BAE6FD" fontSize="14" fontWeight="950">AC = {measure.sideAC} br</text>
      <text x={(stationB.x + stationC.x) / 2 + 24} y={(stationB.y + stationC.y) / 2 - 10} textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="950">{measure.resultLabel}</text>
    </g>
  );
}

function SineTerrain({ state, target, measure, missionOk, onPointerDown, onKeyDown }: TerrainLayerProps) {
  const stationA = terrainFrame.sineA;
  const stationB = sineStationB();
  const stationC = sineStationC();
  const visor = sineVisorPoint(state.cursorProgress);
  const targetVisor = sineVisorPoint(target.targetProgress);

  return (
    <g>
      <text x="450" y="126" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="15" fontWeight="900">
        bir açı-kenar çifti biliniyorsa bilinmeyen açı sinüs oranıyla bulunur
      </text>
      <polygon
        points={`${stationA.x},${stationA.y} ${stationB.x},${stationB.y} ${stationC.x},${stationC.y}`}
        fill={missionOk ? 'rgba(110,231,183,0.18)' : 'rgba(167,139,250,0.13)'}
        stroke={missionOk ? '#6EE7B7' : '#DDD6FE'}
        strokeWidth="5"
        strokeLinejoin="round"
        filter="url(#terrain-glow)"
      />
      <line x1={stationB.x} y1={stationB.y} x2={visor.x} y2={visor.y} stroke="#A78BFA" strokeWidth="8" strokeLinecap="round" opacity="0.86" filter="url(#terrain-glow)" />
      <line x1={stationB.x} y1={stationB.y} x2={stationC.x} y2={stationC.y} stroke="#FBBF24" strokeWidth="4" strokeDasharray="10 9" />
      <Arc cx={stationA.x} cy={stationA.y} radius={78} endAngle={measure.angleA} color="#22D3EE" label={`A=${measure.angleA.toFixed(0)}°`} />
      <SineArc cx={stationB.x} cy={stationB.y} angle={measure.angleB} color="#A78BFA" label={`B=${measure.angleB.toFixed(0)}°`} />
      <TargetRing testId="terrain-sine-target" x={targetVisor.x} y={targetVisor.y} active color={target.accent} label="sinüs hedefi" />
      <Station testId="terrain-station-a" x={stationA.x} y={stationA.y} label="A" color="#22D3EE" />
      <Station testId="terrain-station-b" x={stationB.x} y={stationB.y} label="B" color="#A78BFA" />
      <Station testId="terrain-station-c" x={stationC.x} y={stationC.y} label="C" color="#FBBF24" />
      <SurveyHandle x={visor.x} y={visor.y} label="vizör" color={target.accent} progress={state.cursorProgress} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      <text x={(stationB.x + stationC.x) / 2 + 16} y={(stationB.y + stationC.y) / 2 - 10} textAnchor="middle" fill="#FEF3C7" fontSize="14" fontWeight="950">BC = {measure.sideBC} br</text>
      <text x={(stationA.x + stationC.x) / 2 - 22} y={(stationA.y + stationC.y) / 2 - 14} textAnchor="middle" fill="#DDD6FE" fontSize="14" fontWeight="950">AC = {measure.sideAC} br</text>
    </g>
  );
}

function ReportTerrain({ state, target, measure, missionOk, onPointerDown, onKeyDown }: TerrainLayerProps) {
  const x = 240 + state.cursorProgress * 420;
  const targetX = 450;
  return (
    <g>
      <text x="450" y="126" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="15" fontWeight="900">
        rapor mühürü iki teoremin kullanım koşulunu ayırır
      </text>
      <line x1="240" y1="320" x2="660" y2="320" stroke="rgba(251,191,36,0.34)" strokeWidth="16" strokeLinecap="round" />
      <line x1={targetX} y1="236" x2={targetX} y2="404" stroke="rgba(255,255,255,0.24)" strokeDasharray="8 10" strokeWidth="3" />
      <TargetRing testId="terrain-report-target" x={targetX} y={320} active color={target.accent} label="rapor" />
      <SurveyHandle x={x} y={320} label="mühür" color={target.accent} progress={state.cursorProgress} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />
      <ReportCard x={150} y={438} title="Kosinüs" value="iki kenar + aradaki açı -> eksik kenar" color="#22D3EE" />
      <ReportCard x={480} y={438} title="Sinüs" value="açı-kenar çifti + bir kenar -> eksik açı" color="#A78BFA" />
      <motion.text
        x="450"
        y="220"
        textAnchor="middle"
        fill={missionOk ? '#D1FAE5' : '#FEF3C7'}
        fontSize="22"
        fontWeight="950"
        animate={{ opacity: missionOk ? [0.58, 1, 0.58] : 1 }}
        transition={{ duration: 1.2, repeat: missionOk ? Infinity : 0 }}
      >
        {measure.resultLabel}
      </motion.text>
    </g>
  );
}

interface TerrainLayerProps {
  state: TerrainState;
  target: TerrainMissionTarget;
  measure: TerrainMeasure;
  missionOk: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}

function Station({ testId, x, y, label, color }: { testId: string; x: number; y: number; label: string; color: string }) {
  return (
    <g data-testid={testId}>
      <circle cx={x} cy={y} r="28" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#terrain-glow)" />
      <text x={x} y={y + 6} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="950">{label}</text>
    </g>
  );
}

function SurveyHandle({ stationTestId, x, y, label, color, progress, onPointerDown, onKeyDown }: {
  stationTestId?: string;
  x: number;
  y: number;
  label: string;
  color: string;
  progress: number;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      data-testid="terrain-surveyor-handle"
      role="slider"
      tabIndex={0}
      focusable="true"
      aria-label="Arazi ölçüm kolu"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-keyshortcuts="ArrowLeft ArrowRight Home"
      transform={`translate(${x} ${y})`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{ cursor: 'grab' }}
    >
      {stationTestId ? <circle data-testid={stationTestId} r="31" fill="transparent" /> : null}
      <circle r="36" fill="transparent" />
      <circle r="25" fill="#07111c" stroke={color} strokeWidth="5" filter="url(#terrain-glow)" />
      <text y="5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="950">{label}</text>
    </g>
  );
}

function TargetRing({ testId, x, y, active, color, label }: { testId: string; x: number; y: number; active: boolean; color: string; label: string }) {
  return (
    <g data-testid={testId} className="pointer-events-none">
      <circle cx={x} cy={y} r={active ? 34 : 24} fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth={active ? 4 : 2} opacity={active ? 0.95 : 0.44} filter={active ? 'url(#terrain-glow)' : undefined} />
      <text x={x} y={y + 58} textAnchor="middle" fill={color} fontSize="12" fontWeight="950" opacity={active ? 1 : 0.58}>{label}</text>
    </g>
  );
}

function Arc({ cx, cy, radius, endAngle, color, label }: { cx: number; cy: number; radius: number; endAngle: number; color: string; label: string }) {
  const endX = cx + Math.cos((endAngle * Math.PI) / 180) * radius;
  const endY = cy - Math.sin((endAngle * Math.PI) / 180) * radius;
  return (
    <g>
      <path d={`M ${cx + radius} ${cy} A ${radius} ${radius} 0 0 0 ${endX} ${endY}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <text x={cx + 88} y={cy - 58} fill={color} fontSize="14" fontWeight="950">{label}</text>
    </g>
  );
}

function SineArc({ cx, cy, angle, color, label }: { cx: number; cy: number; angle: number; color: string; label: string }) {
  const radius = 78;
  const endX = cx - Math.cos((angle * Math.PI) / 180) * radius;
  const endY = cy - Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <g>
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <text x={cx - 126} y={cy - 44} fill={color} fontSize="14" fontWeight="950">{label}</text>
    </g>
  );
}

function ReportCard({ x, y, title, value, color }: { x: number; y: number; title: string; value: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="270" height="98" rx="24" fill="rgba(0,0,0,0.28)" stroke={color} strokeWidth="2" />
      <text x={x + 135} y={y + 34} textAnchor="middle" fill={color} fontSize="16" fontWeight="950">{title}</text>
      <foreignObject x={x + 20} y={y + 46} width="230" height="42">
        <p className="text-center text-[13px] font-black leading-tight text-white/76">{value}</p>
      </foreignObject>
    </g>
  );
}

function FormulaReadout({ activeIndex, measure, missionOk }: { activeIndex: number; measure: TerrainMeasure; missionOk: boolean }) {
  return (
    <g>
      <rect x="150" y="548" width="600" height="60" rx="24" fill={missionOk ? 'rgba(110,231,183,0.13)' : 'rgba(0,0,0,0.24)'} stroke={missionOk ? '#6EE7B7' : 'rgba(255,255,255,0.13)'} />
      <text x="450" y="572" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="13" fontWeight="900">ölçüm {activeIndex + 1}/3 · {measure.formulaLine}</text>
      <motion.text
        x="450"
        y="596"
        textAnchor="middle"
        fill={missionOk ? '#D1FAE5' : '#E0F2FE'}
        fontSize="18"
        fontWeight="950"
        animate={{ opacity: missionOk ? [0.62, 1, 0.62] : 1 }}
        transition={{ duration: 1.2, repeat: missionOk ? Infinity : 0 }}
      >
        {measure.resultLabel}
      </motion.text>
    </g>
  );
}
