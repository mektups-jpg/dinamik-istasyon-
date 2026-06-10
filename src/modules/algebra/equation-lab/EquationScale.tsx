import { motion } from 'motion/react';

interface EquationScaleProps {
  leftLabel: string;
  rightLabel: string;
  tilt: number;
}

type ScaleTone = 'cyan' | 'violet';
type ScaleSide = 'left' | 'right';

const PIVOT_X = 450;
const PIVOT_Y = 154;
const ARM_LENGTH = 284;
const STRING_LENGTH = 132;
const PAN_WIDTH = 260;
const PAN_HEIGHT = 96;
const CABLE_TOP_OFFSET = 50;
const CABLE_PAN_OFFSET = 76;
const spring = { type: 'spring' as const, stiffness: 82, damping: 15 };

export function EquationScale({ leftLabel, rightLabel, tilt }: EquationScaleProps) {
  const clampedTilt = Math.max(-10, Math.min(10, tilt));
  const angle = (clampedTilt * Math.PI) / 180;
  const leftAnchor = {
    x: PIVOT_X - ARM_LENGTH * Math.cos(angle),
    y: PIVOT_Y - ARM_LENGTH * Math.sin(angle),
  };
  const rightAnchor = {
    x: PIVOT_X + ARM_LENGTH * Math.cos(angle),
    y: PIVOT_Y + ARM_LENGTH * Math.sin(angle),
  };
  const leftPan = { x: leftAnchor.x, y: leftAnchor.y + STRING_LENGTH };
  const rightPan = { x: rightAnchor.x, y: rightAnchor.y + STRING_LENGTH };
  const leftHeavy = clampedTilt < -1;
  const rightHeavy = clampedTilt > 1;
  const statusLabel = leftHeavy ? 'SOL KEFE AŞAĞIDA' : rightHeavy ? 'SAĞ KEFE AŞAĞIDA' : 'TERAZİ DENGEDE';
  const statusHint = leftHeavy ? 'Sol taraf daha ağır görünüyor.' : rightHeavy ? 'Sağ taraf daha ağır görünüyor.' : 'Kefeler aynı hizada.';

  return (
    <motion.div
      layout
      data-testid="equation-scale"
      className="relative overflow-hidden rounded-[34px] border border-cyan-100/12 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_72%_72%,rgba(168,85,247,0.14),transparent_34%),linear-gradient(180deg,rgba(8,20,36,0.96),rgba(2,6,23,0.94))] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_70px_rgba(2,6,23,0.44)] sm:px-4"
    >
      <div className="pointer-events-none absolute inset-x-10 top-10 h-32 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/2 h-48 w-[76%] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <svg className="relative block h-[430px] w-full" viewBox="0 0 900 462" role="img" aria-label="Hareketli denklem terazisi">
        <defs>
          <linearGradient id="equationBackdrop" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#12304A" stopOpacity="0.62" />
            <stop offset="62%" stopColor="#071527" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.76" />
          </linearGradient>
          <linearGradient id="equationBeam" x1="132" x2="768" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="17%" stopColor="#A5F3FC" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="83%" stopColor="#F0ABFC" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="equationBeamEdge" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="equationLeftPan" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="equationRightPan" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="equationColumn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.88" />
            <stop offset="42%" stopColor="#67E8F9" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#164E63" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="equationMetal" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.5" />
            <stop offset="54%" stopColor="#334155" stopOpacity="0.74" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.96" />
          </linearGradient>
          <filter id="equationGlow" x="-35%" y="-70%" width="170%" height="240%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="equationPanShadow" x="-28%" y="-35%" width="156%" height="185%">
            <feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#020617" floodOpacity="0.72" />
          </filter>
        </defs>

        <rect x="36" y="26" width="828" height="408" rx="42" fill="url(#equationBackdrop)" />
        <path d="M96 376 C176 422 724 422 804 376" fill="none" stroke="#7DD3FC" strokeOpacity="0.08" strokeWidth="44" />
        <motion.path
          d="M132 372 C254 392 646 392 768 372"
          fill="none"
          stroke="#67E8F9"
          strokeOpacity="0.12"
          strokeWidth="2"
          strokeDasharray="8 14"
          animate={{ opacity: clampedTilt === 0 ? 0.34 : 0.16 }}
        />

        <StatusBadge label={statusLabel} hint={statusHint} />

        <motion.ellipse
          cx={leftPan.x}
          cy={leftPan.y + PAN_HEIGHT + 24}
          rx={leftHeavy ? 148 : 108}
          ry={leftHeavy ? 24 : 13}
          fill="#22D3EE"
          filter="url(#equationGlow)"
          animate={{ cx: leftPan.x, cy: leftPan.y + PAN_HEIGHT + 24, opacity: leftHeavy ? 0.66 : 0.16 }}
          transition={spring}
        />
        <motion.ellipse
          cx={rightPan.x}
          cy={rightPan.y + PAN_HEIGHT + 24}
          rx={rightHeavy ? 148 : 108}
          ry={rightHeavy ? 24 : 13}
          fill="#C084FC"
          filter="url(#equationGlow)"
          animate={{ cx: rightPan.x, cy: rightPan.y + PAN_HEIGHT + 24, opacity: rightHeavy ? 0.66 : 0.16 }}
          transition={spring}
        />

        <ellipse cx="450" cy="426" rx="190" ry="17" fill="#020617" opacity="0.56" />
        <path d="M450 174 C490 244 528 338 566 408 H334 C372 338 410 244 450 174 Z" fill="url(#equationMetal)" stroke="#E0F2FE" strokeOpacity="0.16" />
        <path d="M362 402 H538 C566 402 592 420 600 438 H300 C308 420 334 402 362 402 Z" fill="url(#equationMetal)" stroke="#E0F2FE" strokeOpacity="0.16" />
        <rect x="437" y="176" width="26" height="210" rx="13" fill="url(#equationColumn)" filter="url(#equationGlow)" />

        <motion.g
          animate={{ rotate: clampedTilt }}
          transition={spring}
          style={{ transformBox: 'view-box', transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
        >
          <rect x="130" y={PIVOT_Y - 16} width="640" height="32" rx="16" fill="#020617" opacity="0.34" />
          <rect x="130" y={PIVOT_Y - 11} width="640" height="22" rx="11" fill="url(#equationBeam)" filter="url(#equationGlow)" />
          <rect x="146" y={PIVOT_Y - 9} width="608" height="6" rx="3" fill="url(#equationBeamEdge)" opacity="0.5" />
          <line
            x1={PIVOT_X - ARM_LENGTH - CABLE_TOP_OFFSET}
            y1={PIVOT_Y}
            x2={PIVOT_X - ARM_LENGTH + CABLE_TOP_OFFSET}
            y2={PIVOT_Y}
            stroke="#A5F3FC"
            strokeOpacity="0.32"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={PIVOT_X + ARM_LENGTH - CABLE_TOP_OFFSET}
            y1={PIVOT_Y}
            x2={PIVOT_X + ARM_LENGTH + CABLE_TOP_OFFSET}
            y2={PIVOT_Y}
            stroke="#F0ABFC"
            strokeOpacity="0.32"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={PIVOT_X - ARM_LENGTH - CABLE_TOP_OFFSET} cy={PIVOT_Y} r="8" fill="#A5F3FC" stroke="#020617" strokeWidth="3" />
          <circle cx={PIVOT_X - ARM_LENGTH + CABLE_TOP_OFFSET} cy={PIVOT_Y} r="8" fill="#A5F3FC" stroke="#020617" strokeWidth="3" />
          <circle cx={PIVOT_X + ARM_LENGTH - CABLE_TOP_OFFSET} cy={PIVOT_Y} r="8" fill="#F0ABFC" stroke="#020617" strokeWidth="3" />
          <circle cx={PIVOT_X + ARM_LENGTH + CABLE_TOP_OFFSET} cy={PIVOT_Y} r="8" fill="#F0ABFC" stroke="#020617" strokeWidth="3" />
        </motion.g>

        <circle cx={PIVOT_X} cy={PIVOT_Y} r="48" fill="#082F49" stroke="#BAE6FD" strokeOpacity="0.24" />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r="35" fill="#0F2742" stroke="#E0F2FE" strokeOpacity="0.24" />
        <motion.circle
          cx={PIVOT_X}
          cy={PIVOT_Y}
          r="16"
          fill="#F8FAFC"
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'view-box', transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
        />

        <ScaleCable side="left" anchor={leftAnchor} pan={leftPan} heavy={leftHeavy} />
        <ScaleCable side="right" anchor={rightAnchor} pan={rightPan} heavy={rightHeavy} />
        <ScalePan side="left" x={leftPan.x} y={leftPan.y} label="Sol kefe" value={leftLabel} tone="cyan" heavy={leftHeavy} />
        <ScalePan side="right" x={rightPan.x} y={rightPan.y} label="Sağ kefe" value={rightLabel} tone="violet" heavy={rightHeavy} />
      </svg>
    </motion.div>
  );
}

function StatusBadge({ label, hint }: { label: string; hint: string }) {
  return (
    <g>
      <rect x="302" y="42" width="296" height="52" rx="20" fill="#020617" opacity="0.72" stroke="#67E8F9" strokeOpacity="0.16" />
      <path d="M320 52 H580" stroke="#67E8F9" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
      <text x="450" y="65" textAnchor="middle" fill="#A5F3FC" fontSize="12" fontWeight="900" letterSpacing="4">
        {label}
      </text>
      <text x="450" y="83" textAnchor="middle" fill="#CBD5E1" fontSize="12" fontWeight="700">
        {hint}
      </text>
    </g>
  );
}

function ScaleCable({
  side,
  anchor,
  pan,
  heavy,
}: {
  side: ScaleSide;
  anchor: { x: number; y: number };
  pan: { x: number; y: number };
  heavy: boolean;
}) {
  const color = side === 'left' ? '#BAE6FD' : '#F5D0FE';
  const leftCable = `M${anchor.x - CABLE_TOP_OFFSET} ${anchor.y + 8} L${pan.x - CABLE_PAN_OFFSET} ${pan.y + 18}`;
  const rightCable = `M${anchor.x + CABLE_TOP_OFFSET} ${anchor.y + 8} L${pan.x + CABLE_PAN_OFFSET} ${pan.y + 18}`;

  return (
    <g>
      <CableSegment d={leftCable} color={color} heavy={heavy} />
      <CableSegment d={rightCable} color={color} heavy={heavy} />
    </g>
  );
}

function CableSegment({ d, color, heavy }: { d: string; color: string; heavy: boolean }) {
  return (
    <>
      <motion.path
        d={d}
        stroke="#020617"
        strokeWidth="7"
        strokeLinecap="round"
        opacity={heavy ? 0.34 : 0.24}
        animate={{ d, opacity: heavy ? 0.34 : 0.24 }}
        transition={spring}
      />
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity={heavy ? 0.94 : 0.72}
        animate={{ d, opacity: heavy ? 0.94 : 0.72 }}
        transition={spring}
      />
      <motion.path
        d={d}
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity={heavy ? 0.38 : 0.2}
        animate={{ d, opacity: heavy ? 0.38 : 0.2 }}
        transition={spring}
      />
    </>
  );
}

function ScalePan({
  x,
  y,
  label,
  value,
  tone,
  heavy,
}: {
  side: ScaleSide;
  x: number;
  y: number;
  label: string;
  value: string;
  tone: ScaleTone;
  heavy: boolean;
}) {
  const fill = tone === 'cyan' ? 'url(#equationLeftPan)' : 'url(#equationRightPan)';
  const stroke = tone === 'cyan' ? '#67E8F9' : '#F0ABFC';
  const valueFontSize = value.length > 10 ? 30 : value.length > 6 ? 36 : 48;

  return (
    <motion.g
      filter="url(#equationPanShadow)"
      animate={{ x: x - PAN_WIDTH / 2, y, scale: heavy ? 1.04 : 1 }}
      transition={spring}
    >
      <path
        d={`M32 28 C56 8 ${PAN_WIDTH - 56} 8 ${PAN_WIDTH - 32} 28`}
        fill="none"
        stroke="#020617"
        strokeOpacity="0.24"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d={`M18 37 C18 16 38 6 66 6 H${PAN_WIDTH - 66} C${PAN_WIDTH - 38} 6 ${PAN_WIDTH - 18} 16 ${PAN_WIDTH - 18} 37 V66 C${PAN_WIDTH - 18} 88 ${PAN_WIDTH - 48} 102 ${PAN_WIDTH / 2} 102 C48 102 18 88 18 66 Z`}
        fill={fill}
        stroke={stroke}
        strokeOpacity={heavy ? 0.78 : 0.42}
      />
      <path
        d={`M25 39 C44 18 ${PAN_WIDTH - 44} 18 ${PAN_WIDTH - 25} 39`}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.34"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M30 63 C58 82 ${PAN_WIDTH - 58} 82 ${PAN_WIDTH - 30} 63`}
        fill="none"
        stroke="#020617"
        strokeOpacity="0.18"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d={`M32 24 C56 14 ${PAN_WIDTH - 56} 14 ${PAN_WIDTH - 32} 24`}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.28"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={PAN_WIDTH / 2 - CABLE_PAN_OFFSET} cy="18" r="7" fill="#020617" opacity="0.34" />
      <circle cx={PAN_WIDTH / 2 + CABLE_PAN_OFFSET} cy="18" r="7" fill="#020617" opacity="0.34" />
      <circle cx={PAN_WIDTH / 2 - CABLE_PAN_OFFSET} cy="18" r="4" fill={stroke} opacity="0.72" />
      <circle cx={PAN_WIDTH / 2 + CABLE_PAN_OFFSET} cy="18" r="4" fill={stroke} opacity="0.72" />
      <path
        d={`M18 52 C46 62 ${PAN_WIDTH - 46} 62 ${PAN_WIDTH - 18} 52`}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M26 76 C60 96 ${PAN_WIDTH - 60} 96 ${PAN_WIDTH - 26} 76`}
        fill="none"
        stroke="#020617"
        strokeOpacity="0.28"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text x={PAN_WIDTH / 2} y="35" textAnchor="middle" fill="#E2E8F0" opacity="0.76" fontSize="12" fontWeight="900" letterSpacing="4">
        {label.toUpperCase()}
      </text>
      <text x={PAN_WIDTH / 2} y="75" textAnchor="middle" fill="#F8FAFC" fontSize={valueFontSize} fontWeight="900">
        {value}
      </text>
    </motion.g>
  );
}
