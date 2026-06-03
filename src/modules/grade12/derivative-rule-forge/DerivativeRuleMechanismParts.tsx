import { motion } from 'motion/react';

export function RuleFlowRail({ d, color, active, missionId, width = 8 }: { d: string; color: string; active: boolean; missionId: string; width?: number }) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={active ? 0.24 : 0.14}
        strokeWidth={width + 10}
        strokeLinecap="round"
        filter={`url(#forge-glow-${missionId})`}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={active ? 1 : 0.62}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray="30 18"
        filter={`url(#forge-glow-${missionId})`}
        animate={{ strokeDashoffset: [0, -96], opacity: active ? [0.7, 1, 0.7] : [0.42, 0.74, 0.42] }}
        transition={{ strokeDashoffset: { duration: 1.45, repeat: Infinity, ease: 'linear' }, opacity: { duration: 1.8, repeat: Infinity } }}
      />
    </g>
  );
}

export function RuleCartridgeCore({
  active,
  accent,
  glow,
  missionId,
  solved,
  symbol,
}: {
  active: boolean;
  accent: string;
  glow: string;
  missionId: string;
  solved: boolean;
  symbol: string;
}) {
  const symbolFontSize = symbol.length > 1 ? 28 : 38;

  return (
    <motion.g
      animate={{ scale: solved ? [1, 1.04, 1] : 1 }}
      transition={{ duration: 1.6, repeat: solved ? Infinity : 0 }}
    >
      <rect
        x="398"
        y="104"
        width="218"
        height="152"
        rx="44"
        fill="rgba(3,17,27,0.95)"
        stroke={glow}
        strokeOpacity="0.62"
        strokeWidth="4"
        filter={`url(#forge-glow-${missionId})`}
      />
      <rect x="366" y="164" width="62" height="34" rx="17" fill="rgba(2,7,13,0.92)" stroke="#00E5FF" strokeOpacity="0.52" strokeWidth="3" />
      <rect x="586" y="164" width="62" height="34" rx="17" fill="rgba(2,7,13,0.92)" stroke={active ? accent : '#00E5FF'} strokeOpacity="0.56" strokeWidth="3" />
      <motion.circle
        cx="507"
        cy="180"
        r="60"
        fill={active ? `${accent}18` : 'rgba(255,255,255,0.045)'}
        stroke={active ? accent : 'rgba(255,255,255,0.18)'}
        strokeWidth="4"
        strokeDasharray="16 10"
        animate={{ strokeDashoffset: active ? [0, -52] : 0 }}
        transition={{ duration: 2.2, repeat: active ? Infinity : 0, ease: 'linear' }}
      />
      <circle cx="507" cy="180" r="42" fill="rgba(2,7,13,0.74)" stroke={active ? `${accent}88` : 'rgba(255,255,255,0.12)'} strokeWidth="2" />
      <text x="507" y="163" fill="rgba(255,255,255,0.54)" fontSize="13" fontWeight="900" textAnchor="middle">KURAL</text>
      <text x="507" y="201" fill="#FFFFFF" fontSize={symbolFontSize} fontWeight="900" textAnchor="middle">{symbol}</text>
    </motion.g>
  );
}

export function RuleTag({ x, y, label, color, compact = false }: { x: number; y: number; label: string; color: string; compact?: boolean }) {
  const width = compact ? Math.max(82, label.length * 12 + 30) : Math.max(148, Math.min(210, label.length * 11 + 34));
  const height = compact ? 32 : 36;
  const fontSize = compact ? 14 : label.length > 13 ? 14 : 16;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={height / 2} fill="rgba(2,7,13,0.94)" stroke="rgba(255,255,255,0.16)" strokeWidth="4" />
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={height / 2} fill="rgba(2,7,13,0.94)" stroke={color} strokeOpacity="0.82" strokeWidth="2" />
      <text x="0" y="6" fill="#FFFFFF" fontSize={fontSize} fontWeight="900" textAnchor="middle" stroke="rgba(0,0,0,0.44)" strokeWidth="3" paintOrder="stroke">{label}</text>
    </g>
  );
}
