import { AlarmMode } from './derivativeNonexistentModel';

interface TrackProps {
  accent: string;
  solved: boolean;
  scanProgress: number;
}

interface SvgPoint {
  x: number;
  y: number;
}

export function CornerTrack({ accent, solved, scanProgress }: TrackProps) {
  const leftOpacity = scanProgress <= 0.54 ? 0.92 : 0.45;
  const rightOpacity = scanProgress >= 0.46 ? 0.92 : 0.45;
  const proofColor = solved ? '#00FF88' : accent;

  return (
    <g>
      <path d="M 166 382 L 500 160 L 834 382" fill="none" stroke="#071420" strokeWidth="42" strokeLinecap="round" opacity="0.96" />
      <path d="M 166 382 L 500 160 L 834 382" fill="none" stroke="url(#alarm-track-sharp-corner)" strokeWidth="22" strokeLinecap="round" opacity="0.98" />
      <path d="M 166 382 L 500 160" fill="none" stroke="#00E5FF" strokeWidth="34" strokeLinecap="round" opacity={leftOpacity * 0.34} />
      <path d="M 500 160 L 834 382" fill="none" stroke={accent} strokeWidth="34" strokeLinecap="round" opacity={rightOpacity * 0.34} />

      <path d="M 232 352 L 500 190" fill="none" stroke="#9FF5FF" strokeWidth="4" strokeDasharray="12 10" opacity={leftOpacity} />
      <path d="M 500 190 L 768 352" fill="none" stroke="#FFB3D7" strokeWidth="4" strokeDasharray="12 10" opacity={rightOpacity} />

      <g transform="translate(500 160)">
        <circle r="76" fill="#06121d" stroke={proofColor} strokeWidth="2" opacity="0.34" />
        <circle r="56" fill="#04111f" stroke={proofColor} strokeWidth="7" />
        <circle r="33" fill={proofColor} opacity="0.18" />
        <circle r="13" fill={proofColor} />
        <path d="M -38 40 L 0 6 L 38 40" fill="none" stroke={proofColor} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(528 204)">
        <rect width="84" height="30" rx="13" fill="#020913" stroke={proofColor} strokeWidth="2" opacity="0.96" />
        <text x="42" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">x=2</text>
      </g>

      <g transform="translate(278 164)">
        <rect width="82" height="34" rx="15" fill="#020913" stroke="#00E5FF" strokeWidth="2" opacity="0.9" />
        <text x="41" y="23" textAnchor="middle" fill="#9FF5FF" fontSize="13" fontWeight="900">sol</text>
      </g>

      <g transform="translate(640 164)">
        <rect width="82" height="34" rx="15" fill="#020913" stroke="#FF4FA3" strokeWidth="2" opacity="0.9" />
        <text x="41" y="23" textAnchor="middle" fill="#FFB3D7" fontSize="13" fontWeight="900">sağ</text>
      </g>

      <g transform="translate(395 246)">
        <rect width="210" height="64" rx="24" fill="#020913" stroke={proofColor} strokeWidth="2" opacity="0.94" />
        <text x="105" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900">
          {solved ? "f'(2) yok" : 'tek teğet?'}
        </text>
      </g>

      {solved && <circle cx="500" cy="356" r="18" fill="#00FF88" opacity="0.92" />}
    </g>
  );
}

export function GapTrack({ accent, solved, scanProgress }: TrackProps) {
  const leftActive = scanProgress < 0.5;
  const proofColor = solved ? '#00FF88' : accent;

  return (
    <g>
      <path d="M 142 366 C 274 344 358 276 448 228" fill="none" stroke="#071420" strokeWidth="42" strokeLinecap="round" opacity="0.96" />
      <path d="M 552 292 C 662 246 746 214 868 166" fill="none" stroke="#071420" strokeWidth="42" strokeLinecap="round" opacity="0.96" />
      <path d="M 142 366 C 274 344 358 276 448 228" fill="none" stroke="#00E5FF" strokeWidth="22" strokeLinecap="round" filter="url(#alarm-glow-broken-track)" opacity={leftActive ? 1 : 0.62} />
      <path d="M 552 292 C 662 246 746 214 868 166" fill="none" stroke={accent} strokeWidth="22" strokeLinecap="round" filter="url(#alarm-glow-broken-track)" opacity={leftActive ? 0.62 : 1} />

      <g transform="translate(450 152)">
        <rect width="100" height="202" rx="30" fill="#020913" stroke={proofColor} strokeDasharray="12 10" strokeWidth="4" opacity="0.95" />
        <rect x="23" y="18" width="54" height="166" rx="20" fill={accent} opacity="0.08" />
        <text x="50" y="104" textAnchor="middle" fill={proofColor} fontSize="13" fontWeight="900" fontFamily="monospace">x=2</text>
      </g>

      <circle cx="448" cy="228" r="19" fill="#020913" stroke="#00E5FF" strokeWidth="7" />
      <circle cx="552" cy="292" r="19" fill="#020913" stroke={accent} strokeWidth="7" />
      <circle cx="500" cy="260" r="50" fill={accent} opacity="0.08" />

      <g transform="translate(210 166)">
        <rect width="86" height="34" rx="15" fill="#020913" stroke="#00E5FF" strokeWidth="2" opacity="0.9" />
        <text x="43" y="23" textAnchor="middle" fill="#9FF5FF" fontSize="13" fontWeight="900">sol</text>
      </g>

      <g transform="translate(704 166)">
        <rect width="86" height="34" rx="15" fill="#020913" stroke={accent} strokeWidth="2" opacity="0.9" />
        <text x="43" y="23" textAnchor="middle" fill="#FFB3D7" fontSize="13" fontWeight="900">sağ</text>
      </g>

      <g transform="translate(640 324)">
        <rect width="230" height="58" rx="22" fill="#020913" stroke={proofColor} strokeWidth="2" opacity="0.94" />
        <text x="115" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">
          {solved ? "f'(2) yok" : 'kesintisizlik?'}
        </text>
      </g>
    </g>
  );
}

export function getScanPoint(mode: AlarmMode, progress: number): SvgPoint {
  if (mode === 'corner') {
    const x = 190 + progress * 620;
    const y = x <= 500 ? 360 - (x - 190) * 0.61 : 170 + (x - 500) * 0.61;
    return { x, y };
  }

  if (progress < 0.48) {
    const t = progress / 0.48;
    return {
      x: 160 + t * 288,
      y: 350 - t * 122,
    };
  }

  const t = (progress - 0.52) / 0.48;
  return {
    x: 552 + Math.max(0, Math.min(1, t)) * 298,
    y: 292 - Math.max(0, Math.min(1, t)) * 116,
  };
}

export function progressFromSvgPoint(mode: AlarmMode, point: SvgPoint) {
  if (mode === 'corner') {
    return clamp01((point.x - 190) / 620);
  }

  if (point.x < 500) {
    return clamp(point.x, 160, 448, 0, 0.48);
  }

  return clamp(point.x, 552, 850, 0.52, 1);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function clamp(value: number, min: number, max: number, outMin: number, outMax: number) {
  const t = (Math.max(min, Math.min(max, value)) - min) / (max - min);
  return outMin + t * (outMax - outMin);
}
