import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { ForgeMission, isRuleCorrect, MODULE_ID, RuleTool, toolCopy } from './derivativeRuleModel';

interface DerivativeRuleSceneProps {
  mission: ForgeMission;
  tool: RuleTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function DerivativeRuleScene({ mission, tool, solved, status, onHome }: DerivativeRuleSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatches = isRuleCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const checkedCorrect = checked && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const statusLabel = solved
    ? 'Kural döküldü'
    : tool === null
      ? 'Kartuş bekliyor'
      : checkedCorrect
        ? 'Doğru kural çalışıyor'
        : status === 'error'
          ? 'Yanlış kural alarmı'
          : 'Kartuş önizlemede';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_34%,rgba(0,229,255,0.12),transparent_42%),radial-gradient(circle_at_72%_64%,rgba(179,136,255,0.10),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.04)_0_1px,transparent_1px_94px)] opacity-50" />

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
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif üretim</p>
              <p className="truncate text-sm font-black text-white/88">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: status === 'error' ? '#FF4FA355' : `${accent}44`,
                color: status === 'error' ? '#FF8ABB' : accent,
                backgroundColor: status === 'error' ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(7,24,43,0.96),rgba(3,8,18,0.78)_55%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
              {solved ? 'kural formülü' : 'üretim isteği'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">
              {solved ? mission.expression : mission.structure}
            </p>
          </div>

          <ForgeMechanism mission={mission} tool={tool} solved={solved} status={status} accent={accent} toolMatches={toolMatches} />

          {tool !== null && (
            <motion.div
              className="absolute left-1/2 top-[79%] z-50 flex w-[min(66%,720px)] -translate-x-1/2 items-center justify-between gap-4 rounded-[28px] border bg-[#041725]/98 px-5 py-3 shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
              style={{ borderColor: status === 'error' ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: status === 'error' ? '#FF8ABB' : accent }}>
                  {status === 'error' ? 'alarm' : solved ? 'döküm kanıtı' : 'seçilen kartuş'}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white/95 lg:text-base">
                  {status === 'error' ? mission.failure[tool] : solved ? mission.success : toolCopy[tool].hint}
                </p>
              </div>
              <div
                className="grid h-[64px] w-[96px] shrink-0 place-items-center rounded-[24px] border bg-[#050b13]/78 px-2 text-center font-mono text-base font-black leading-tight text-white"
                style={{ borderColor: status === 'error' ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${status === 'error' ? '#FF4FA3' : accent}33` }}
              >
                {status === 'error' ? '!' : solved ? mission.badge : toolCopy[tool].short}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ForgeMechanism({ mission, tool, solved, status, accent, toolMatches }: { mission: ForgeMission; tool: RuleTool | null; solved: boolean; status: Grade12StageStatus; accent: string; toolMatches: boolean }) {
  const active = tool !== null;
  const alarm = status === 'error';
  const checkedCorrect = status === 'success' && toolMatches;
  const activeTool = tool ?? 'sum';
  const glow = alarm ? '#FF4FA3' : checkedCorrect ? accent : active ? accent : '#00E5FF';
  const outputLabel = solved ? mission.output : tool ? previewOutput(tool) : 'çıktı ?';
  const outputBadge = solved ? mission.badge : tool ? toolCopy[tool].label : 'Kartuş bekliyor';
  const mechanismCopy = solved
    ? mission.mechanism
    : tool
      ? toolCopy[tool].hint
      : 'Kartuş seçilince hangi parçanın türevlenip hangi parçanın korunacağı burada görünür.';

  return (
    <div className="absolute inset-x-[5%] top-[23%] z-20 h-[54%]">
      <div className="absolute inset-0 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.60))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} türev kural döküm bandı`}>
        <defs>
          <linearGradient id={`forge-belt-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.92" />
            <stop offset="52%" stopColor={glow} stopOpacity="1" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.86" />
          </linearGradient>
          <filter id={`forge-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 8 }).map((_, index) => (
          <line key={`vx-${index}`} x1={140 + index * 100} x2={140 + index * 100} y1="46" y2="314" stroke="rgba(255,255,255,0.055)" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <line key={`hy-${index}`} x1="86" x2="928" y1={70 + index * 48} y2={70 + index * 48} stroke="rgba(255,255,255,0.06)" />
        ))}

        <motion.path
          d="M110 214 C260 186 358 186 450 214 C552 246 656 246 902 202"
          fill="none"
          stroke={`url(#forge-belt-${mission.id})`}
          strokeWidth="22"
          strokeLinecap="round"
          filter={`url(#forge-glow-${mission.id})`}
          animate={{ pathLength: active ? [0.82, 1, 0.82] : 1 }}
          transition={{ duration: 2.2, repeat: active ? Infinity : 0 }}
        />

        <FunctionCapsule x={210} y={150} label={mission.inputA} color="#00E5FF" />
        <FunctionCapsule x={210} y={254} label={mission.inputB} color="#00FF88" />

        <motion.g
          animate={{ scale: solved ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 1.6, repeat: solved ? Infinity : 0 }}
        >
          <rect x="388" y="92" width="238" height="176" rx="42" fill="rgba(3,17,27,0.94)" stroke={glow} strokeOpacity="0.56" strokeWidth="4" filter={`url(#forge-glow-${mission.id})`} />
          <rect x="428" y="122" width="158" height="72" rx="28" fill={active ? `${accent}22` : 'rgba(255,255,255,0.055)'} stroke={active ? accent : 'rgba(255,255,255,0.18)'} strokeWidth="3" />
          <text x="507" y="151" fill="rgba(255,255,255,0.52)" fontSize="15" fontWeight="900" textAnchor="middle">KURAL KARTUŞU</text>
          <text x="507" y="183" fill="#FFFFFF" fontSize="34" fontWeight="900" textAnchor="middle">{tool ? toolCopy[tool].short : '?'}</text>
        </motion.g>

        <RuleArms tool={activeTool} active={active} accent={accent} alarm={alarm} mission={mission} revealFormula={solved} />

        <OutputCapsule x={788} y={174} label={outputLabel} color={checkedCorrect ? '#00FF88' : active ? accent : '#00E5FF'} />
        <text x="788" y="244" fill="rgba(255,255,255,0.72)" fontSize="20" fontWeight="900" textAnchor="middle">{outputBadge}</text>

        {active && (
          <motion.rect
            x="350"
            y="70"
            width="314"
            height="226"
            rx="54"
            fill={alarm ? 'rgba(255,79,163,0.10)' : `${accent}10`}
            stroke={alarm ? '#FF4FA377' : `${accent}66`}
            strokeWidth="3"
            animate={{ opacity: solved ? [0.55, 0.9, 0.55] : 0.62 }}
            transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
          />
        )}
      </svg>

      <div className="sr-only">{mission.proof}</div>

      <div className="absolute left-[7%] bottom-[6%] z-30 rounded-[26px] border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-4 py-3 shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">giriş kapsülleri</p>
        <p className="mt-1 text-xl font-black text-white">{mission.inputA} · {mission.inputB}</p>
      </div>

      <div className="absolute right-[7%] bottom-[6%] z-30 max-w-[330px] rounded-[26px] border border-[#00FF88]/18 bg-[#00FF88]/9 px-4 py-3 text-right shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50">mekanik okuma</p>
        <p className="mt-1 text-sm font-black leading-snug text-white/78">{mechanismCopy}</p>
      </div>
    </div>
  );
}

function previewOutput(tool: RuleTool) {
  const outputs: Record<RuleTool, string> = {
    sum: 'iki ışın',
    difference: 'ters ışın',
    product: 'iki kol',
    quotient: 'pay/zırh',
    chain: 'halka/çekirdek',
  };

  return outputs[tool];
}

function RuleArms({ tool, active, accent, alarm, mission, revealFormula }: { tool: RuleTool; active: boolean; accent: string; alarm: boolean; mission: ForgeMission; revealFormula: boolean }) {
  const color = alarm ? '#FF4FA3' : accent;

  if (!active) {
    return (
      <g opacity="0.64">
        <line x1="298" y1="150" x2="388" y2="150" stroke="#00E5FF" strokeWidth="7" strokeLinecap="round" />
        <line x1="298" y1="254" x2="388" y2="218" stroke="#00FF88" strokeWidth="7" strokeLinecap="round" />
        <text x="505" y="312" fill="rgba(255,255,255,0.52)" fontSize="18" fontWeight="900" textAnchor="middle">kartuş seç, bandın nasıl çalıştığını izle</text>
      </g>
    );
  }

  if (tool === 'product') {
    return (
      <g>
        <path d="M302 148 C388 110 470 106 620 142" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
        <path d="M302 254 C388 292 470 292 620 218" fill="none" stroke="#00FF88" strokeWidth="9" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
        <RuleTag x={506} y={90} label={revealFormula ? 'fʼ·g' : 'türevle · koru'} color={color} />
        <RuleTag x={508} y={296} label={revealFormula ? 'f·gʼ' : 'koru · türevle'} color="#00FF88" />
      </g>
    );
  }

  if (tool === 'quotient') {
    return (
      <g>
        <path d="M308 140 C420 96 520 100 650 138" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
        <path d="M316 238 C438 276 520 274 648 226" fill="none" stroke="#FF4FA3" strokeWidth="8" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
        <rect x="388" y="246" width="238" height="38" rx="19" fill="rgba(255,184,77,0.12)" stroke="#FFB84D" strokeWidth="3" />
        <RuleTag x={510} y={82} label={revealFormula ? 'fʼg - fgʼ' : 'pay bandı'} color={color} />
        <RuleTag x={508} y={313} label={revealFormula ? 'g² kalkanı' : 'payda zırhı'} color="#FFB84D" />
      </g>
    );
  }

  if (tool === 'chain') {
    return (
      <g>
        <circle cx="506" cy="178" r="102" fill="rgba(179,136,255,0.08)" stroke={color} strokeWidth="8" filter={`url(#forge-glow-${mission.id})`} />
        <circle cx="506" cy="178" r="54" fill="rgba(0,229,255,0.09)" stroke="#00E5FF" strokeWidth="7" />
        <path d="M302 202 C396 178 438 178 452 178" fill="none" stroke="#00E5FF" strokeWidth="8" strokeLinecap="round" />
        <path d="M560 178 C622 178 676 176 714 174" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
        <RuleTag x={506} y={74} label={revealFormula ? 'dış türev' : 'dış halka'} color={color} />
        <RuleTag x={506} y={192} label={revealFormula ? 'iç türev' : 'iç çekirdek'} color="#00E5FF" />
      </g>
    );
  }

  return (
    <g>
      <path d="M302 150 C382 150 438 156 502 174" fill="none" stroke="#00E5FF" strokeWidth="9" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
      <path d="M302 254 C392 248 452 226 502 194" fill="none" stroke={tool === 'difference' ? '#FF8ABB' : '#00FF88'} strokeWidth="9" strokeLinecap="round" filter={`url(#forge-glow-${mission.id})`} />
      <RuleTag x={432} y={122} label={revealFormula ? 'fʼ' : '1. ışın'} color="#00E5FF" />
      <RuleTag x={434} y={270} label={revealFormula ? (tool === 'difference' ? '-gʼ' : 'gʼ') : tool === 'difference' ? 'ters ışın' : '2. ışın'} color={tool === 'difference' ? '#FF8ABB' : '#00FF88'} />
    </g>
  );
}

function FunctionCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-84" y="-30" width="168" height="60" rx="24" fill="rgba(2,7,13,0.88)" stroke={color} strokeOpacity="0.62" strokeWidth="3" />
      <text x="0" y="7" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

function OutputCapsule({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-116" y="-38" width="232" height="76" rx="30" fill="rgba(2,7,13,0.90)" stroke={color} strokeOpacity="0.70" strokeWidth="3" />
      <text x="0" y="8" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}

function RuleTag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-74" y="-18" width="148" height="36" rx="18" fill="rgba(2,7,13,0.86)" stroke={color} strokeOpacity="0.65" strokeWidth="2" />
      <text x="0" y="6" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">{label}</text>
    </g>
  );
}
