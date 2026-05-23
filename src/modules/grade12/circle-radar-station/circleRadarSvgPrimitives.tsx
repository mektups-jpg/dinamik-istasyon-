import { motion } from 'motion/react';

export const center = { x: 465, y: 322 };
export const radius = 215;

export function PulsePoint({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        r="22"
        fill={color}
        opacity="0.18"
        animate={{ opacity: [0.10, 0.28, 0.10] }}
        transition={{ duration: 1.7, repeat: Infinity }}
      />
      <circle cx={x} cy={y} r="9" fill={color} stroke="#FFFFFF" strokeOpacity="0.88" strokeWidth="3" />
      <text x={x} y={y - 24} fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

export function OutputCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-122" y="-38" width="244" height="76" rx="30" fill="rgba(2,7,13,0.90)" stroke={color} strokeOpacity="0.70" strokeWidth="3" />
      <text x="0" y="8" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

export function RuleTag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-126" y="-21" width="252" height="42" rx="21" fill="rgba(2,7,13,0.88)" stroke={color} strokeOpacity="0.72" strokeWidth="2" />
      <text x="0" y="7" fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

export function polarToCartesian(angleDegrees: number, customRadius = radius) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    x: center.x + customRadius * Math.cos(angleRadians),
    y: center.y + customRadius * Math.sin(angleRadians),
  };
}

export function arcPath(startAngle: number, endAngle: number, customRadius = radius) {
  const start = polarToCartesian(startAngle, customRadius);
  const end = polarToCartesian(endAngle, customRadius);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1;

  return `M ${start.x} ${start.y} A ${customRadius} ${customRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}
