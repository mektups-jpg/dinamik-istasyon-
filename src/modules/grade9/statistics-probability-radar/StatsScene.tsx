import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { BoxPlotModel, GroupData, GroupKey, Point, StatsPointerHandler } from './types';
import { deviation, scaleBoxValue } from './statsModel';

interface StatsSceneProps {
  activeIndex: number;
  scanner: Point;
  medianHandle: Point;
  scannerLocked: boolean;
  medianLocked: boolean;
  selectedGroup: GroupKey;
  groups: GroupData[];
  boxPlot: BoxPlotModel;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerDown: StatsPointerHandler;
  onPointerMove: (event: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGElement>) => void;
}

export function StatsScene(props: StatsSceneProps) {
  const { activeIndex, scanner, medianHandle, scannerLocked, medianLocked, selectedGroup, groups, boxPlot, svgRef, onPointerDown, onPointerMove, onPointerUp } = props;

  return (
    <section data-testid="stats-scene" className="relative overflow-hidden rounded-[34px] border border-lime-200/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(190,242,100,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_36%,rgba(0,229,255,0.12),transparent_52%)]" />
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-lime-100/55">makro atom: MAT.9.6.x</p>
          <h2 className="text-2xl font-black text-white">Veriyi Tara, Kararı Gör</h2>
        </div>
        <div className="rounded-2xl border border-lime-200/25 bg-lime-200/10 px-4 py-2 font-mono text-sm font-black text-lime-100">
          {activeIndex === 0 ? `seçilen: ${selectedGroup}` : (medianLocked ? 'medyan kilitli' : 'medyan ara')}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 500"
        className="relative h-[500px] w-full touch-none rounded-[28px] border border-white/10 bg-[#020602]/70 sm:h-[520px]"
        style={{ touchAction: 'none' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <filter id="stats-v4-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {activeIndex === 0 ? (
          <DistributionScanner groups={groups} scanner={scanner} scannerLocked={scannerLocked} onPointerDown={onPointerDown} />
        ) : (
          <BoxPlotReader boxPlot={boxPlot} medianHandle={medianHandle} medianLocked={medianLocked} onPointerDown={onPointerDown} />
        )}
      </svg>
    </section>
  );
}

function DistributionScanner({ groups, scanner, scannerLocked, onPointerDown }: { groups: GroupData[]; scanner: Point; scannerLocked: boolean; onPointerDown: StatsPointerHandler }) {
  return (
    <>
      <rect x="60" y="92" width="600" height="326" rx="34" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" />
      {groups.map((group) => (
        <DataCloud key={group.key} group={group} active={scannerLocked && group.key === 'B'} />
      ))}
      <g data-testid="stats-scanner" onPointerDown={(event) => !scannerLocked && onPointerDown(event, { kind: 'scanner' })} style={{ cursor: scannerLocked ? 'default' : 'grab', touchAction: 'none' }}>
        <motion.circle cx={scanner.x} cy={scanner.y} r="76" fill="rgba(190,242,100,0.08)" stroke={scannerLocked ? '#00FF88' : '#BEF264'} strokeWidth="5" strokeDasharray="10 9" filter="url(#stats-v4-glow)" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <circle cx={scanner.x} cy={scanner.y} r="94" fill="transparent" />
        <text x={scanner.x} y={scanner.y + 6} textAnchor="middle" fill={scannerLocked ? '#00FF88' : '#BEF264'} fontSize="18" fontWeight="900">σ tarayıcı</text>
      </g>
      <text x="360" y="460" textAnchor="middle" fill={scannerLocked ? '#00FF88' : 'rgba(255,255,255,0.62)'} fontSize="22" fontWeight="900">
        {scannerLocked ? 'En istikrarlı grup: Sınıf B' : 'Tarayıcıyı en dar veri bulutunun üstüne taşı'}
      </text>
    </>
  );
}

function DataCloud({ group, active }: { group: GroupData; active: boolean }) {
  const avg = group.values.reduce((sum, value) => sum + value, 0) / group.values.length;
  const sigma = deviation(group.values);
  return (
    <g>
      <text x={group.x} y="128" textAnchor="middle" fill={active ? '#00FF88' : group.color} fontSize="25" fontWeight="900">Sınıf {group.key}</text>
      <text x={group.x} y="154" textAnchor="middle" fill="rgba(255,255,255,0.54)" fontSize="14" fontWeight="900">σ={sigma.toFixed(1)}</text>
      <line x1={group.x} y1="178" x2={group.x} y2="342" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      {group.values.map((value, index) => {
        const x = group.x + (value - avg) * 3;
        const y = 204 + index * 34;
        return (
          <motion.circle
            key={value}
            cx={x}
            cy={y}
            r={active ? 14 : 11}
            fill={active ? '#00FF88' : group.color}
            filter="url(#stats-v4-glow)"
            animate={{ opacity: active ? [0.78, 1, 0.78] : [0.52, 0.9, 0.52] }}
            transition={{ duration: 1.3, delay: index * 0.08, repeat: Infinity }}
          />
        );
      })}
    </g>
  );
}

function BoxPlotReader({ boxPlot, medianHandle, medianLocked, onPointerDown }: { boxPlot: BoxPlotModel; medianHandle: Point; medianLocked: boolean; onPointerDown: StatsPointerHandler }) {
  const minX = scaleBoxValue(boxPlot.min);
  const q1X = scaleBoxValue(boxPlot.q1);
  const medianX = scaleBoxValue(boxPlot.median);
  const q3X = scaleBoxValue(boxPlot.q3);
  const maxX = scaleBoxValue(boxPlot.max);

  return (
    <>
      <rect x="70" y="100" width="580" height="316" rx="34" fill="rgba(0,229,255,0.045)" stroke="rgba(0,229,255,0.22)" strokeWidth="3" />
      <text x="360" y="148" textAnchor="middle" fill="#A5F3FC" fontSize="24" fontWeight="900">Kutu-bıyık medyan okuyucu</text>
      <line x1={minX} y1="260" x2={maxX} y2="260" stroke="rgba(255,255,255,0.54)" strokeWidth="6" strokeLinecap="round" />
      <line x1={minX} y1="226" x2={minX} y2="294" stroke="#FF6B9A" strokeWidth="5" />
      <line x1={maxX} y1="226" x2={maxX} y2="294" stroke="#FF6B9A" strokeWidth="5" />
      <rect x={q1X} y="216" width={q3X - q1X} height="88" rx="18" fill="rgba(0,229,255,0.14)" stroke="#00E5FF" strokeWidth="4" />
      <line x1={medianX} y1="196" x2={medianX} y2="324" stroke="rgba(0,255,136,0.34)" strokeWidth="8" strokeLinecap="round" />
      {[
        ['Min', minX], ['Q1', q1X], ['Medyan', medianX], ['Q3', q3X], ['Max', maxX],
      ].map(([label, x]) => <text key={label} x={Number(x)} y="348" textAnchor="middle" fill="rgba(255,255,255,0.64)" fontSize="14" fontWeight="900">{label}</text>)}
      <g data-testid="stats-median-handle" onPointerDown={(event) => !medianLocked && onPointerDown(event, { kind: 'median' })} style={{ cursor: medianLocked ? 'default' : 'grab', touchAction: 'none' }}>
        <motion.line x1={medianHandle.x} y1="184" x2={medianHandle.x} y2="336" stroke={medianLocked ? '#00FF88' : '#FBBF24'} strokeWidth="6" strokeDasharray="9 9" animate={{ opacity: [0.56, 1, 0.56] }} transition={{ duration: 1.1, repeat: Infinity }} />
        <circle cx={medianHandle.x} cy={medianHandle.y} r="36" fill={medianLocked ? 'rgba(0,255,136,0.18)' : 'rgba(251,191,36,0.16)'} stroke={medianLocked ? '#00FF88' : '#FBBF24'} strokeWidth="4" filter="url(#stats-v4-glow)" />
        <circle cx={medianHandle.x} cy={medianHandle.y} r="54" fill="transparent" />
        <text x={medianHandle.x} y={medianHandle.y + 6} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">Medyan</text>
      </g>
      <text x="360" y="450" textAnchor="middle" fill={medianLocked ? '#00FF88' : 'rgba(255,255,255,0.62)'} fontSize="22" fontWeight="900">
        {medianLocked ? 'Medyan veriyi iki eş yarıya böler' : 'Sarı okuyucuyu kutunun orta çizgisine sürükle'}
      </text>
    </>
  );
}
