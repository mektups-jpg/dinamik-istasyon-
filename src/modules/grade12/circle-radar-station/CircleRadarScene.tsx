import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import {
  CircleRadarMission,
  isCircleRadarCorrect,
  MODULE_ID,
  previewOutput,
  RadarTool,
  toolCopy,
} from './circleRadarModel';
import { arcPath, center, OutputCapsule, polarToCartesian, PulsePoint, radius, RuleTag } from './circleRadarSvgPrimitives';

interface CircleRadarSceneProps {
  mission: CircleRadarMission;
  tool: RadarTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function CircleRadarScene({ mission, tool, solved, status, onHome }: CircleRadarSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatches = isCircleRadarCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const checkedCorrect = checked && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const alarm = status === 'error';
  const statusLabel = solved
    ? 'Radar kanıtı kilitlendi'
    : tool === null
      ? 'Radar bekliyor'
      : checkedCorrect
        ? 'Doğru mod çalışıyor'
        : alarm
          ? 'Yanlış mod alarmı'
          : 'Mod önizlemede';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(0,229,255,0.16),transparent_42%),radial-gradient(circle_at_66%_70%,rgba(0,255,136,0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.045)_0_1px,transparent_1px_92px),linear-gradient(180deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_92px)] opacity-45" />

      <div className="relative flex h-full w-full items-center justify-center px-5 py-3">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-full min-h-[540px] w-[98%] max-w-[1220px] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ perspective: 1200 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[2%] z-30 flex w-[min(94%,980px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/44 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif radar görevi</p>
              <p className="truncate text-sm font-black text-white/88">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: alarm ? '#FF4FA355' : `${accent}44`,
                color: alarm ? '#FF8ABB' : accent,
                backgroundColor: alarm ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[7%] h-[89%] rounded-[54px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(5,20,35,0.96),rgba(2,10,18,0.72)_56%,rgba(1,5,11,0.96))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/18 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
              {solved ? 'radar kanıtı' : 'sensör okuması'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">{solved ? mission.formula : mission.sensor}</p>
          </div>

          <RadarMachine mission={mission} tool={tool} solved={solved} status={status} accent={accent} />

          {tool !== null && (
            <motion.div
              className="absolute left-1/2 top-[80%] z-50 flex w-[min(70%,760px)] -translate-x-1/2 items-center justify-between gap-4 rounded-[28px] border bg-[#041725]/98 px-5 py-3 shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
              style={{ borderColor: alarm ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: alarm ? '#FF8ABB' : accent }}>
                  {alarm ? 'radar alarmı' : solved ? 'çember kanıtı' : 'seçilen radar modu'}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white/95 lg:text-base">
                  {alarm ? mission.failure[tool] : solved ? mission.success : toolCopy[tool].hint}
                </p>
              </div>
              <div
                className="grid h-[64px] w-[98px] shrink-0 place-items-center rounded-[24px] border bg-[#050b13]/78 px-2 text-center font-mono text-[15px] font-black leading-tight text-white"
                style={{ borderColor: alarm ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${alarm ? '#FF4FA3' : accent}33` }}
              >
                {alarm ? '!' : solved ? mission.badge : toolCopy[tool].short}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function RadarMachine({ mission, tool, solved, status, accent }: { mission: CircleRadarMission; tool: RadarTool | null; solved: boolean; status: Grade12StageStatus; accent: string }) {
  const active = tool !== null;
  const alarm = status === 'error';
  const checkedCorrect = status === 'success' && isCircleRadarCorrect(mission, tool);
  const glow = alarm ? '#FF4FA3' : checkedCorrect ? '#00FF88' : active ? accent : '#00E5FF';
  const outputLabel = solved ? mission.output : tool ? previewOutput(tool) : 'mod ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Mod bekliyor';

  return (
    <div className="absolute inset-x-[4%] top-[21%] z-20 h-[56%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.58))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 620" role="img" aria-label={`${mission.title} çember radar istasyonu`}>
        <defs>
          <radialGradient id={`dish-fill-${mission.id}`} cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#0B2B3A" stopOpacity="0.86" />
            <stop offset="62%" stopColor="#062032" stopOpacity="0.68" />
            <stop offset="100%" stopColor="#020711" stopOpacity="0.94" />
          </radialGradient>
          <filter id={`radar-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`beam-gradient-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
            <stop offset="56%" stopColor={glow} stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <RadarGrid />
        <RadarDish missionId={mission.id} active={active} solved={solved} glow={glow} />
        {tool === null ? <IdleRadar missionId={mission.id} /> : <ToolOverlay tool={tool} alarm={alarm} solved={solved} accent={glow} missionId={mission.id} />}
        <OutputCapsule x={808} y={316} label={outputLabel} color={checkedCorrect ? '#00FF88' : active ? accent : '#00E5FF'} />
        <text x="808" y="382" fill="rgba(255,255,255,0.72)" fontSize="20" fontWeight="900" textAnchor="middle">{outputBadge}</text>
      </svg>
      {solved && <div className="sr-only">{mission.proof}</div>}
    </div>
  );
}

function RadarGrid() {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, index) => (
        <line key={`vx-${index}`} x1={122 + index * 92} x2={122 + index * 92} y1="70" y2="552" stroke="rgba(255,255,255,0.045)" />
      ))}
      {Array.from({ length: 5 }).map((_, index) => (
        <line key={`hy-${index}`} x1="78" x2="922" y1={112 + index * 84} y2={112 + index * 84} stroke="rgba(255,255,255,0.05)" />
      ))}
      <ellipse cx={center.x} cy="566" rx="250" ry="26" fill="rgba(0,0,0,0.24)" />
    </g>
  );
}

function RadarDish({ missionId, active, solved, glow }: { missionId: string; active: boolean; solved: boolean; glow: string }) {
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <circle cx={center.x} cy={center.y} r={radius + 34} fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
      <circle cx={center.x} cy={center.y} r={radius} fill={`url(#dish-fill-${missionId})`} stroke="#00E5FF" strokeOpacity="0.72" strokeWidth="6" />
      <circle cx={center.x} cy={center.y} r="132" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
      <circle cx={center.x} cy={center.y} r="76" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <line x1={center.x - radius} x2={center.x + radius} y1={center.y} y2={center.y} stroke="rgba(255,255,255,0.10)" />
      <line x1={center.x} x2={center.x} y1={center.y - radius} y2={center.y + radius} stroke="rgba(255,255,255,0.10)" />
      <motion.g
        animate={{ rotate: active ? [0, 360] : [0, 18, 0] }}
        transition={{ duration: active ? 9 : 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${center.x}px ${center.y}px` }}
      >
        <path d={`M${center.x} ${center.y} L${center.x + radius - 12} ${center.y - 14} A${radius - 12} ${radius - 12} 0 0 1 ${center.x + radius - 12} ${center.y + 14} Z`} fill={glow} opacity="0.16" />
        <line x1={center.x} x2={center.x + radius - 10} y1={center.y} y2={center.y} stroke={glow} strokeWidth="4" strokeLinecap="round" opacity="0.58" />
      </motion.g>
      <circle cx={center.x} cy={center.y} r="28" fill="#03111B" stroke={glow} strokeWidth="5" />
      <circle cx={center.x} cy={center.y} r="8" fill={glow} />
      <text x={center.x} y={center.y + radius + 58} fill="rgba(255,255,255,0.86)" fontSize="16" fontWeight="900" textAnchor="middle">
        {solved ? 'kanıt radarında ölçüm kilitlendi' : 'çember radarını bir modla tarat'}
      </text>
    </g>
  );
}

function IdleRadar({ missionId }: { missionId: string }) {
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <circle cx={center.x - 118} cy={center.y - 96} r="8" fill="#00E5FF" opacity="0.82" />
      <circle cx={center.x + 126} cy={center.y + 70} r="8" fill="#00FF88" opacity="0.72" />
      <circle cx={center.x + 64} cy={center.y - 132} r="6" fill="#B388FF" opacity="0.76" />
      <text x={center.x} y={center.y - 232} fill="#00E5FF" fontSize="18" fontWeight="900" textAnchor="middle">
        radar modu seçilince ilişki ışınla görünür
      </text>
    </g>
  );
}

function ToolOverlay({ tool, alarm, solved, accent, missionId }: { tool: RadarTool; alarm: boolean; solved: boolean; accent: string; missionId: string }) {
  const overlayProps = { alarm, solved, accent, missionId };

  if (tool === 'secant') return <SecantOverlay {...overlayProps} />;
  if (tool === 'chord') return <ChordOverlay {...overlayProps} />;
  if (tool === 'tangent') return <TangentOverlay {...overlayProps} />;
  if (tool === 'arc') return <ArcOverlay {...overlayProps} />;
  if (tool === 'inscribed-angle') return <InscribedAngleOverlay {...overlayProps} />;
  if (tool === 'central-angle') return <CentralAngleOverlay {...overlayProps} />;
  return <AreaOverlay {...overlayProps} />;
}

function SecantOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <motion.line
        x1="244"
        x2="756"
        y1="210"
        y2="434"
        stroke={`url(#beam-gradient-${missionId})`}
        strokeWidth="11"
        strokeLinecap="round"
        animate={{ opacity: solved ? [0.75, 1, 0.75] : 0.92 }}
        transition={{ duration: 1.5, repeat: solved ? Infinity : 0 }}
      />
      <PulsePoint x={355} y={258} color={color} label="P1" />
      <PulsePoint x={646} y={386} color={color} label="P2" />
      <RuleTag x={500} y={168} label={solved ? 'iki kesişim = kesen' : 'iki temas taranıyor'} color={color} />
    </g>
  );
}

function ChordOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <motion.line
        x1="346"
        x2="654"
        y1="410"
        y2="232"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        animate={{ strokeWidth: solved ? [12, 16, 12] : 12 }}
        transition={{ duration: 1.6, repeat: solved ? Infinity : 0 }}
      />
      <line x1={center.x} x2="500" y1={center.y} y2="321" stroke="rgba(255,255,255,0.40)" strokeWidth="3" strokeDasharray="8 8" />
      <PulsePoint x={346} y={410} color={color} label="A" />
      <PulsePoint x={654} y={232} color={color} label="B" />
      <RuleTag x={500} y={468} label={solved ? 'kiriş: iç bağlantı' : 'iç bağ taranıyor'} color={color} />
    </g>
  );
}

function TangentOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  const tangentX = center.x + radius;
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <motion.line
        x1={tangentX}
        x2={tangentX}
        y1="102"
        y2="542"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        animate={{ opacity: solved ? [0.74, 1, 0.74] : 0.92 }}
        transition={{ duration: 1.4, repeat: solved ? Infinity : 0 }}
      />
      <line x1={center.x} x2={tangentX} y1={center.y} y2={center.y} stroke="#FFFFFF" strokeOpacity="0.74" strokeWidth="5" strokeLinecap="round" />
      <path d={`M${tangentX - 38} ${center.y} L${tangentX - 38} ${center.y + 38} L${tangentX} ${center.y + 38}`} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <PulsePoint x={tangentX} y={center.y} color={color} label="T" />
      <RuleTag x={719} y={256} label={solved ? 'yarıçap ⟂ teğet' : 'tek temas taranıyor'} color={color} />
    </g>
  );
}

function ArcOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  const start = -138;
  const end = -38;
  const startPoint = polarToCartesian(start);
  const endPoint = polarToCartesian(end);
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <path d={arcPath(start, end, radius + 9)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="22" strokeLinecap="round" />
      <motion.path
        d={arcPath(start, end, radius + 9)}
        fill="none"
        stroke={color}
        strokeWidth="18"
        strokeLinecap="round"
        animate={{ pathLength: solved ? [0.78, 1, 0.78] : 1 }}
        transition={{ duration: 1.5, repeat: solved ? Infinity : 0 }}
      />
      <PulsePoint x={startPoint.x} y={startPoint.y} color={color} label="A" />
      <PulsePoint x={endPoint.x} y={endPoint.y} color={color} label="B" />
      <RuleTag x={500} y={104} label={solved ? 'yay ölçüsü 100°' : 'eğri yay taranıyor'} color={color} />
    </g>
  );
}

function InscribedAngleOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  const arcStart = -138;
  const arcEnd = -38;
  const a = polarToCartesian(arcStart);
  const b = polarToCartesian(arcEnd);
  const p = polarToCartesian(104);
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <path d={arcPath(arcStart, arcEnd, radius + 8)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.92" />
      <line x1={p.x} x2={a.x} y1={p.y} y2={a.y} stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1={p.x} x2={b.x} y1={p.y} y2={b.y} stroke={color} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${p.x + 32} ${p.y - 10} Q${p.x + 60} ${p.y - 42} ${p.x + 30} ${p.y - 72}`} fill="none" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="4" strokeLinecap="round" />
      <PulsePoint x={p.x} y={p.y} color={color} label="P" />
      <RuleTag x={298} y={454} label={solved ? '100° yay -> 50° açı' : 'çevre bakışı taranıyor'} color={color} />
      <text x="340" y="500" fill="rgba(255,255,255,0.68)" fontSize="18" fontWeight="900">{solved ? 'çevre noktası yay ölçüsünü yarıya indirir' : 'çember üstü göz yay izini görüyor'}</text>
    </g>
  );
}

function CentralAngleOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  const arcStart = -138;
  const arcEnd = -38;
  const a = polarToCartesian(arcStart);
  const b = polarToCartesian(arcEnd);
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <path d={arcPath(arcStart, arcEnd, radius + 8)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
      <path d={`M${center.x} ${center.y} L${a.x} ${a.y} A${radius} ${radius} 0 0 1 ${b.x} ${b.y} Z`} fill={color} opacity="0.13" />
      <line x1={center.x} x2={a.x} y1={center.y} y2={a.y} stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1={center.x} x2={b.x} y1={center.y} y2={b.y} stroke={color} strokeWidth="7" strokeLinecap="round" />
      <RuleTag x={500} y={250} label={solved ? 'merkez açı = 100°' : 'merkez bakışı taranıyor'} color={color} />
      <text x="500" y="282" fill="rgba(255,255,255,0.68)" fontSize="18" fontWeight="900" textAnchor="middle">{solved ? 'merkezden görülen yay bire bir okunur' : 'iki yarıçap yay bölgesini tarıyor'}</text>
    </g>
  );
}

function AreaOverlay({ alarm, solved, accent, missionId }: OverlayProps) {
  const color = alarm ? '#FF4FA3' : accent;
  return (
    <g filter={`url(#radar-glow-${missionId})`}>
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius - 8}
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="8"
        animate={{ fillOpacity: solved ? [0.18, 0.34, 0.18] : 0.22 }}
        transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
      />
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = index * 36;
        const p = polarToCartesian(angle, radius - 10);
        return <line key={angle} x1={center.x} x2={p.x} y1={center.y} y2={p.y} stroke="rgba(255,255,255,0.20)" strokeWidth="2" />;
      })}
      <line x1={center.x} x2={center.x + radius - 10} y1={center.y} y2={center.y} stroke="#FFFFFF" strokeOpacity="0.78" strokeWidth="6" strokeLinecap="round" />
      <RuleTag x={500} y={center.y - 42} label={solved ? 'A = πr²' : 'disk alanı taranıyor'} color={color} />
      <text x={center.x + 96} y={center.y - 18} fill="#FFFFFF" fontSize="18" fontWeight="900">r</text>
    </g>
  );
}

interface OverlayProps {
  alarm: boolean;
  solved: boolean;
  accent: string;
  missionId: string;
}
