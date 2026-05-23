import { motion } from 'motion/react';
import { SlopeMission } from './derivativeSlopeModel';

export function TrackPath({ mission, glow }: { mission: SlopeMission; glow: string }) {
  if (mission.mode === 'average') {
    return (
      <path
        d="M104 292 C226 302 332 270 424 216 C520 158 608 122 720 136 C800 146 854 112 916 72"
        fill="none"
        stroke={`url(#slope-track-${mission.id})`}
        strokeWidth="18"
        strokeLinecap="round"
        filter={`url(#slope-glow-${mission.id})`}
      />
    );
  }

  if (mission.mode === 'corner') {
    return (
      <path
        d="M104 284 C250 260 390 210 502 132 C610 214 742 282 916 188"
        fill="none"
        stroke={`url(#slope-track-${mission.id})`}
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#slope-glow-${mission.id})`}
      />
    );
  }

  if (mission.mode === 'gap') {
    return (
      <>
        <path d="M104 286 C250 252 365 228 456 214" fill="none" stroke="#00E5FF" strokeWidth="18" strokeLinecap="round" filter={`url(#slope-glow-${mission.id})`} />
        <path d="M592 174 C700 128 796 118 916 94" fill="none" stroke={glow} strokeWidth="18" strokeLinecap="round" filter={`url(#slope-glow-${mission.id})`} />
      </>
    );
  }

  return (
    <path
      d="M104 292 C232 286 342 250 444 206 C558 158 682 128 916 72"
      fill="none"
      stroke={`url(#slope-track-${mission.id})`}
      strokeWidth="18"
      strokeLinecap="round"
      filter={`url(#slope-glow-${mission.id})`}
    />
  );
}

export function Car({
  x,
  y,
  label,
  color,
  active,
  pulseDelay = 0,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  active: boolean;
  pulseDelay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.circle
        r="22"
        fill="#02070d"
        stroke={color}
        strokeWidth="5"
        animate={{ scale: active ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 1.5, delay: pulseDelay, repeat: active ? Infinity : 0 }}
      />
      <circle r="10" fill={color} opacity="0.22" />
      <text x="-5" y="6" fill="#FFFFFF" fontSize="17" fontWeight="900">{label}</text>
    </g>
  );
}

export function SlopeCapsule({ x, y, angle, label, color }: { x: number; y: number; angle: number; label: string; color: string }) {
  const hasDeltaFraction = label.startsWith('Δy / Δx');
  const suffix = hasDeltaFraction ? label.replace('Δy / Δx', '').trim() : '';
  const width = hasDeltaFraction ? 184 : Math.max(156, Math.min(196, label.length * 9 + 34));

  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-width / 2} y="-22" width={width} height="44" rx="22" fill="rgba(2,7,13,0.86)" stroke={color} strokeOpacity="0.65" strokeWidth="2" />
      {hasDeltaFraction ? (
        <>
          <text x="-42" y="-4" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">Δy</text>
          <line x1="-57" x2="-27" y1="2" y2="2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <text x="-42" y="16" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">Δx</text>
          <text x="28" y="7" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">{suffix}</text>
        </>
      ) : (
        <text x="0" y="6" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">{label}</text>
      )}
    </g>
  );
}

export function liveProbePoint(mission: SlopeMission, progress: number) {
  if (mission.mode === 'average') {
    return averageCurvePoint(progress);
  }

  if (mission.mode === 'tangent') {
    const near = pointOnAngle(mission.a, mission.tangentAngle, mission.id === 'final-tangent-lock' ? 58 : 54);
    const eased = 1 - Math.pow(1 - progress, 1.35);
    const control = {
      x: (mission.b.x + near.x) / 2,
      y: Math.min(mission.b.y, near.y) - (mission.id === 'final-tangent-lock' ? 10 : 22),
    };
    return quadraticPoint(mission.b, control, near, eased);
  }

  if (mission.mode === 'corner') {
    return {
      x: 342 + progress * 326,
      y: progress < 0.5 ? 240 - progress * 216 : 132 + (progress - 0.5) * 224,
    };
  }

  if (mission.mode === 'gap') {
    return {
      x: 350 + progress * 300,
      y: progress < 0.5 ? 228 - progress * 42 : 174 - (progress - 0.5) * 92,
    };
  }

  return interpolatePoint(mission.a, mission.b, Math.max(0.2, progress));
}

export function probeLabelForMission(mission: SlopeMission, progress: number) {
  if (mission.mode === 'average') {
    return progress > 0.7 ? 'geniş aralık' : progress > 0.48 ? 'orta aralık' : 'kısa aralık';
  }
  if (mission.mode === 'tangent') return progress > 0.76 ? 'B -> A, teğet oku' : 'B, A’ya yaklaşmadı';
  if (mission.mode === 'corner') return Math.abs(progress - 0.5) < 0.18 ? 'sivri uç alarmı' : 'kanatlar farklı';
  if (mission.mode === 'gap') return Math.abs(progress - 0.5) < 0.18 ? 'kopuk pist' : 'süreklilik ara';
  return progress > 0.52 ? 'kesen doğru' : 'tek nokta değil';
}

export function tangentEndpoints(cx: number, cy: number, angle: number, length: number) {
  const radians = (angle * Math.PI) / 180;
  const dx = Math.cos(radians) * length;
  const dy = Math.sin(radians) * length;
  return {
    x1: cx - dx / 2,
    y1: cy - dy / 2,
    x2: cx + dx / 2,
    y2: cy + dy / 2,
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function interpolatePoint(a: { x: number; y: number }, b: { x: number; y: number }, progress: number) {
  return {
    x: a.x + (b.x - a.x) * progress,
    y: a.y + (b.y - a.y) * progress,
  };
}

function quadraticPoint(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  progress: number,
) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
}

function averageCurvePoint(progress: number) {
  const pathT = clamp(0.2 + clamp(progress, 0, 1) * 0.6, 0.2, 0.8);

  if (pathT < 1 / 3) {
    return cubicPoint(
      { x: 104, y: 292 },
      { x: 226, y: 302 },
      { x: 332, y: 270 },
      { x: 424, y: 216 },
      pathT * 3,
    );
  }

  if (pathT < 2 / 3) {
    return cubicPoint(
      { x: 424, y: 216 },
      { x: 520, y: 158 },
      { x: 608, y: 122 },
      { x: 720, y: 136 },
      (pathT - 1 / 3) * 3,
    );
  }

  return cubicPoint(
    { x: 720, y: 136 },
    { x: 800, y: 146 },
    { x: 854, y: 112 },
    { x: 916, y: 72 },
    (pathT - 2 / 3) * 3,
  );
}

function cubicPoint(
  start: { x: number; y: number },
  controlA: { x: number; y: number },
  controlB: { x: number; y: number },
  end: { x: number; y: number },
  progress: number,
) {
  const inverse = 1 - progress;
  return {
    x: inverse ** 3 * start.x + 3 * inverse ** 2 * progress * controlA.x + 3 * inverse * progress ** 2 * controlB.x + progress ** 3 * end.x,
    y: inverse ** 3 * start.y + 3 * inverse ** 2 * progress * controlA.y + 3 * inverse * progress ** 2 * controlB.y + progress ** 3 * end.y,
  };
}

function pointOnAngle(point: { x: number; y: number }, angle: number, distance: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: point.x + Math.cos(radians) * distance,
    y: point.y + Math.sin(radians) * distance,
  };
}
