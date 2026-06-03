import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { ContinuityExpressionDisplay } from './ContinuityExpressionDisplay';
import { BridgeMission, BridgeTool, isToolCorrect, mapHeight, MODULE_ID, toolCopy } from './continuityBridgeModel';

interface ContinuityBridgeSceneProps {
  mission: BridgeMission;
  tool: BridgeTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function ContinuityBridgeScene({ mission, tool, solved, status, onHome }: ContinuityBridgeSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const isCorrect = isToolCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const alarm = checked && tool !== null && !isCorrect;
  const checkedCorrect = checked && isCorrect;
  const accent = selected?.accent ?? neutralAccent;
  const statusLabel = solved
    ? mission.issue === 'continuous'
      ? 'Sürekli doğrulandı'
      : 'Süreksizlik nedeni doğrulandı'
    : tool === null
      ? 'Durumu oku'
      : checkedCorrect
        ? 'Doğru karar'
        : alarm
          ? 'Tekrar değerlendir'
          : 'Karar seçildi';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div data-testid={`${MODULE_ID}-scene-visual`} className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_34%,rgba(0,229,255,0.14),transparent_42%),radial-gradient(circle_at_72%_64%,rgba(251,191,36,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.042)_0_1px,transparent_1px_94px)] opacity-50" />

      <div className="relative flex h-full w-full items-start justify-center px-5 py-2">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-full min-h-[560px] w-[98.5%] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ perspective: 1200 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[2%] z-30 flex w-[min(92%,980px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/44 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif köprü</p>
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

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(12,39,54,0.96),rgba(4,10,20,0.78)_55%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />
          <div className="absolute inset-x-[8%] top-[77%] h-[13%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.54))] shadow-[0_26px_64px_rgba(0,0,0,0.42),inset_0_10px_20px_rgba(255,255,255,0.04)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">süreklilik kanıtı</p>
            <ContinuityExpressionDisplay expression={mission.expression} />
          </div>

          <BridgeMechanism mission={mission} tool={tool} solved={solved} checked={checked} accent={accent} isCorrect={isCorrect} />
        </motion.div>
      </div>
    </div>
  );
}

function BridgeMechanism({ mission, tool, solved, checked, accent, isCorrect }: { mission: BridgeMission; tool: BridgeTool | null; solved: boolean; checked: boolean; accent: string; isCorrect: boolean }) {
  const active = tool !== null;
  const alarm = checked && active && !isCorrect;
  const leftY = mapHeight(mission.leftApproach);
  const rightY = mapHeight(mission.rightApproach);
  const limitY = mapHeight(mission.limitValue);
  const pinY = mission.functionValue === null ? limitY + 64 : mapHeight(mission.functionValue);
  const pinExists = mission.functionValue !== null;
  const railsAligned = mission.leftApproach === mission.rightApproach;
  const pinAligned = pinExists && mission.functionValue === mission.limitValue;
  const canSeal = railsAligned && pinAligned;
  const functionLabel = getFunctionLabel(mission.gateLabel);
  const resultLabel = canSeal && pinExists
    ? `limit = ${functionLabel} = ${mission.limitValue}`
    : 'sürekli değil';
  const bridgeColor = alarm ? '#FF4FA3' : checked && isCorrect && canSeal ? '#00FF88' : '#FBBF24';
  const railGlow = tool === 'rails' || tool === 'seal';
  const pinGlow = tool === 'pin' || tool === 'seal';
  const gapGlow = tool === 'gap' || (!canSeal && active);

  return (
    <div className="absolute inset-x-[5%] top-[23%] z-20 h-[54%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} süreklilik köprüsü`}>
        <defs>
          <linearGradient id={`bridge-deck-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.82" />
            <stop offset="50%" stopColor={railGlow ? accent : '#00FF88'} stopOpacity="0.98" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.82" />
          </linearGradient>
          <filter id={`bridge-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 9 }).map((_, index) => (
          <line key={`vx-${index}`} x1={118 + index * 94} x2={118 + index * 94} y1="42" y2="316" stroke="rgba(255,255,255,0.055)" />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <line key={`hy-${index}`} x1="82" x2="930" y1={56 + index * 47} y2={56 + index * 47} stroke="rgba(255,255,255,0.06)" />
        ))}
        <line x1="92" x2="930" y1="294" y2="294" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="132" x2="132" y1="48" y2="318" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="500" x2="500" y1="42" y2="318" stroke={gapGlow ? bridgeColor : 'rgba(255,255,255,0.22)'} strokeDasharray="8 10" strokeWidth="3" />
        <line x1="92" x2="930" y1={limitY} y2={limitY} stroke={railGlow ? accent : '#00E5FF'} strokeOpacity="0.32" strokeDasharray="10 12" strokeWidth="3" />

        <BridgeRail d={`M82 284 C176 258 280 ${leftY + 34} 386 ${leftY + 4} C432 ${leftY - 8} 464 ${leftY - 6} 490 ${leftY}`} active={railGlow} alarm={alarm && tool !== 'pin'} missionId={mission.id} />
        <BridgeRail d={`M510 ${rightY} C574 ${rightY - 10} 626 ${rightY + 24} 706 ${rightY + 16} C790 ${rightY + 8} 860 200 930 160`} active={railGlow} alarm={alarm && tool !== 'pin'} missionId={mission.id} />

        {!railsAligned && (
          <>
            <circle cx="490" cy={leftY} r="11" fill="#02070d" stroke={railGlow ? accent : '#00E5FF'} strokeWidth="3" />
            <circle cx="510" cy={rightY} r="11" fill="#02070d" stroke={railGlow ? accent : '#00E5FF'} strokeWidth="3" />
          </>
        )}
        <text x="178" y={leftY - 18} fill="rgba(159,245,255,0.88)" fontSize="18" fontWeight="900">soldan limit = {mission.leftApproach}</text>
        <text x="690" y={rightY - 18} fill="rgba(184,255,219,0.88)" fontSize="18" fontWeight="900">sağdan limit = {mission.rightApproach}</text>
        {railsAligned ? (
          <text x="600" y={limitY - 48} fill="rgba(159,245,255,0.76)" fontSize="16" fontWeight="900">limit = {mission.limitValue}</text>
        ) : (
          <text x="636" y="78" fill="#FBBF24" fontSize="18" fontWeight="900">iki yan limit birleşmiyor</text>
        )}
        <text x="532" y="318" fill="rgba(255,255,255,0.58)" fontSize="18" fontWeight="900">{mission.gateLabel}</text>
        <text x="112" y="68" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">y</text>
        <text x="904" y="318" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">x</text>

        <PinAssembly x={500} pinY={pinY} limitY={limitY} value={mission.functionValue} functionLabel={functionLabel} active={pinGlow} aligned={pinAligned} color={accent} />
        <SealPlate y={limitY} active={(checked && tool === 'seal') || solved} canSeal={canSeal} color={bridgeColor} />
      </svg>

      <div
        data-testid={`${MODULE_ID}-gap-visual`}
        className="absolute left-1/2 top-[68%] z-30 flex min-h-[58px] w-[190px] -translate-x-1/2 items-center justify-center gap-3 rounded-[22px] border bg-black/62 px-3 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-xl"
        style={{ borderColor: gapGlow ? `${bridgeColor}88` : 'rgba(0,229,255,0.22)' }}
      >
        <div className="min-w-0 text-center">
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/44">nokta</p>
          <p className="mt-0.5 text-lg font-black leading-none text-white">{mission.gateLabel}</p>
        </div>
        <div
          className="rounded-2xl border px-2.5 py-1.5 text-center"
          style={{
            borderColor: pinExists ? (pinAligned ? '#00FF8866' : '#FBBF2466') : '#FF4FA366',
            background: pinExists ? 'rgba(0,229,255,0.08)' : 'rgba(255,79,163,0.10)',
          }}
        >
          <p className="font-mono text-[8px] font-black tracking-[0.08em] text-white/46">{functionLabel}</p>
          <p className="text-lg font-black leading-none text-white">{mission.functionValue ?? 'boş'}</p>
        </div>
      </div>

      <div data-testid={`${MODULE_ID}-rails-readout`} className="sr-only">soldan limit {mission.leftApproach} sağdan limit {mission.rightApproach}</div>
      <div data-testid={`${MODULE_ID}-pin-readout`} className="sr-only">{functionLabel} {mission.functionValue ?? 'boş'}</div>
      <div data-testid={`${MODULE_ID}-seal-readout`} className="sr-only">{resultLabel}</div>

      <div
        className="absolute right-[7%] bottom-[6%] z-30 rounded-[26px] border px-4 py-3 text-center shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl"
        style={{
          borderColor: canSeal ? '#00FF8866' : '#FBBF2455',
          background: canSeal ? 'rgba(0,255,136,0.11)' : 'rgba(251,191,36,0.11)',
        }}
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">sonuç</p>
        <p className="mt-1 text-lg font-black text-white">{resultLabel}</p>
      </div>

      {checked && active && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[24%] z-20 h-[52%] w-[48%] -translate-x-1/2 rounded-[999px] border"
          style={{
            borderColor: alarm ? '#FF4FA377' : `${accent}66`,
            background: alarm ? 'rgba(255,79,163,0.10)' : `${accent}10`,
            boxShadow: `0 0 44px ${alarm ? '#FF4FA3' : accent}26`,
          }}
          animate={{ scaleX: solved ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
        />
      )}
    </div>
  );
}

function BridgeRail({ d, active, alarm, missionId }: { d: string; active: boolean; alarm: boolean; missionId: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={alarm ? '#FF4FA3' : `url(#bridge-deck-${missionId})`}
      strokeWidth={active ? 14 : 11}
      strokeLinecap="round"
      filter={`url(#bridge-glow-${missionId})`}
    />
  );
}

function getFunctionLabel(gateLabel: string) {
  const point = gateLabel.match(/x\s*=\s*(.+)$/)?.[1]?.trim();
  return point ? `f(${point})` : 'f(a)';
}

function PinAssembly({ x, pinY, limitY, value, functionLabel, active, aligned, color }: { x: number; pinY: number; limitY: number; value: number | null; functionLabel: string; active: boolean; aligned: boolean; color: string }) {
  const socketColor = value === null ? '#FF4FA3' : aligned ? '#00FF88' : '#FBBF24';
  const labelY = value === null ? pinY + 4 : pinY + 30;
  return (
    <g>
      <line x1={x} x2={x} y1="22" y2={Math.max(30, pinY - 16)} stroke={active ? color : 'rgba(255,255,255,0.24)'} strokeWidth="6" strokeLinecap="round" />
      <circle cx={x} cy={limitY} r="12" fill="rgba(0,0,0,0.30)" stroke={socketColor} strokeWidth="3" strokeDasharray={value === null ? '7 6' : '0'} />
      <circle cx={x} cy={limitY} r="4" fill={socketColor} />
      {value === null ? (
        <>
          <rect x={x - 39} y={labelY} width="78" height="48" rx="18" fill="rgba(8,16,28,0.92)" stroke="#FF4FA3" strokeWidth="2" />
          <text x={x} y={labelY + 20} textAnchor="middle" fill="#FF8ABB" fontSize="13" fontWeight="900">{functionLabel}</text>
          <text x={x} y={labelY + 39} textAnchor="middle" fill="#FF8ABB" fontSize="20" fontWeight="900">yok</text>
        </>
      ) : (
        <g>
          <line x1={x} x2={x} y1={limitY + 12} y2={labelY} stroke={socketColor} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 5" />
          <rect x={x - 35} y={labelY} width="70" height="50" rx="18" fill="rgba(8,45,60,0.92)" stroke={active ? color : socketColor} strokeWidth="2.5" />
          <text x={x} y={labelY + 18} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="11" fontWeight="900">{functionLabel}</text>
          <text x={x} y={labelY + 42} textAnchor="middle" fill="white" fontSize="27" fontWeight="900">{value}</text>
        </g>
      )}
    </g>
  );
}

function SealPlate({ y, active, canSeal, color }: { y: number; active: boolean; canSeal: boolean; color: string }) {
  if (!active) return null;

  return (
    <motion.g initial={{ opacity: 0, scaleX: 0.62, transformOrigin: 'center' }} animate={{ opacity: 1, scaleX: 1 }}>
      <rect x="436" y={y - 18} width="128" height="36" rx="18" fill={canSeal ? 'rgba(0,255,136,0.26)' : 'rgba(251,191,36,0.18)'} stroke={color} strokeWidth="4" />
      <text x={canSeal ? 448 : 454} y={y + 7} fill="white" fontSize={canSeal ? '16' : '18'} fontWeight="900">{canSeal ? 'SÜREKLİ' : 'AÇIK'}</text>
    </motion.g>
  );
}
