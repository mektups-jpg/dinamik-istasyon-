import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { isToolCorrect, LimitMission, LimitTool, MODULE_ID, toolCopy } from './limitAsymptoteModel';
import type { Grade12StageStatus } from '../shared/Grade12FullStageLab';

interface LimitAsymptoteSceneProps {
  mission: LimitMission;
  tool: LimitTool | null;
  status: Grade12StageStatus;
  solved: boolean;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function LimitAsymptoteScene({ mission, tool, status, solved, onHome }: LimitAsymptoteSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatchesExpected = isToolCorrect(mission, tool);
  const hasToolError = status === 'error' && tool !== null && !toolMatchesExpected;
  const hasMissingToolError = status === 'error' && tool === null;
  const accent = selected?.accent ?? neutralAccent;
  const previewBadge = getPreviewBadge(mission, tool, selected?.short);
  const isFactorFormulaPreview = tool === 'factor' && mission.sceneKind === 'factor' && !solved && !hasToolError;
  const statusLabel = solved
    ? 'Limit kilitlendi'
    : tool === null
      ? hasMissingToolError
        ? 'Okuma eksik'
        : 'Okuma seç'
      : hasToolError
        ? 'Yanlış okuma alarmı'
        : 'Limit önizlemesi';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div data-testid={`${MODULE_ID}-scene-visual`} className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(0,229,255,0.14),transparent_42%),radial-gradient(circle_at_76%_70%,rgba(179,136,255,0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.045)_0_1px,transparent_1px_92px)] opacity-50" />

      <div className="relative flex h-full w-full items-center justify-center px-7 py-6">
        <motion.div
          data-testid={`${MODULE_ID}-manipulator`}
          role="group"
          aria-label={`${mission.title}: ${mission.prompt}`}
          aria-keyshortcuts="Home"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative h-[min(88dvh,700px)] w-[98%] outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/70"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ perspective: 1200 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[3%] z-30 flex w-[min(88%,920px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-black/38 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif görev</p>
              <p className="truncate text-sm font-black text-white/86">{mission.title}</p>
            </div>
            <div
              className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
              style={{
                borderColor: hasToolError ? '#FF4FA355' : `${accent}44`,
                color: hasToolError ? '#FF8ABB' : accent,
                backgroundColor: hasToolError ? 'rgba(255,79,163,0.12)' : `${accent}14`,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="absolute inset-x-[1%] top-[10%] h-[78%] rounded-[68px] border border-[#00E5FF]/10 bg-[linear-gradient(180deg,rgba(12,41,58,0.96),rgba(4,10,20,0.78)_55%,rgba(1,4,10,0.94))] shadow-[0_54px_130px_rgba(0,0,0,0.54),inset_0_1px_0_rgba(255,255,255,0.14)]" />
          <div className="absolute inset-x-[7%] top-[69%] h-[15%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.54))] shadow-[0_26px_64px_rgba(0,0,0,0.42),inset_0_10px_20px_rgba(255,255,255,0.04)]" />

          <div className="absolute left-1/2 top-[15%] z-20 w-max max-w-[min(88vw,760px)] -translate-x-1/2 rounded-[26px] border border-[#00E5FF]/24 bg-[#03111b]/94 px-7 py-3.5 text-center shadow-[0_20px_54px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">limit komutu</p>
            <LimitExpressionDisplay expression={mission.expression} />
            <p className="mt-1 font-mono text-sm font-black text-white/58">{mission.relation}</p>
          </div>

          <MissionStage mission={mission} tool={tool} solved={solved} accent={accent} hasError={hasToolError} />

          {tool !== null && (
            <motion.div
              className="absolute left-1/2 top-[77%] z-50 flex w-[min(72%,740px)] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border bg-[#041725]/98 px-6 py-4 shadow-[0_24px_62px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
              style={{ borderColor: hasToolError ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: hasToolError ? '#FF8ABB' : accent }}>
                  {solved ? 'limit sonucu' : hasToolError ? 'alarm' : 'limit önizlemesi'}
                </p>
                {isFactorFormulaPreview ? (
                  <FactorPreviewEquation expression={mission.expression} />
                ) : (
                  <p className="mt-1 truncate text-base font-black text-white/95">
                    {solved
                      ? mission.resultLabel
                      : hasToolError
                        ? 'Bu okuma görevin limit tipini karşılamıyor'
                        : getPreviewTitle(mission, tool, selected?.label)}
                  </p>
                )}
                <p className="mt-1 hidden text-xs font-bold text-white/64 lg:block">
                  {solved ? mission.proof : hasToolError && tool !== null ? mission.failure[tool] : getPreviewHint(mission, tool, selected?.hint)}
                </p>
              </div>
              <div
                className={`grid h-[78px] w-[88px] shrink-0 place-items-center rounded-[26px] border bg-[#050b13]/78 font-mono font-black text-white ${
                  previewBadge === 'Sol-Sağ' && !solved && !hasToolError ? 'text-sm leading-tight' : 'text-2xl'
                }`}
                style={{ borderColor: hasToolError ? '#FF4FA366' : `${accent}77`, boxShadow: `0 0 32px ${hasToolError ? '#FF4FA3' : accent}33` }}
              >
                {solved ? mission.resultBadge : hasToolError ? '!' : formatPreviewBadge(previewBadge)}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function getPreviewBadge(mission: LimitMission, tool: LimitTool | null, fallback?: string) {
  if (tool === 'two-sided') {
    return 'Sol-Sağ';
  }

  if (tool === 'local') {
    return mission.gateLabel.replace(/^x\s*=\s*/i, '');
  }

  return fallback;
}

function getPreviewTitle(mission: LimitMission, tool: LimitTool | null, fallback = 'Limit okuması') {
  if (tool === 'factor' && mission.sceneKind === 'factor') {
    return 'Sadeleştirilecek ifade';
  }

  if (tool === 'factor') {
    return '0/0 varsa ortak çarpanı ara';
  }

  if (tool === 'two-sided' || tool === 'local' || tool === 'infinity') {
    return `${fallback} pistte iz bırakıyor`;
  }

  return fallback;
}

function getPreviewHint(mission: LimitMission, tool: LimitTool | null, fallback = '') {
  if (tool === 'factor' && mission.sceneKind === 'factor') {
    return 'Pay ve paydadaki ortak (x - 2) sadeleşir; kalan x + 2 ifadesinde x = 2 yazılır.';
  }

  return fallback;
}

function formatPreviewBadge(previewBadge?: string) {
  if (previewBadge === 'Sol-Sağ') {
    return (
      <span className="whitespace-nowrap leading-none">
        Sol-Sağ
      </span>
    );
  }

  return previewBadge;
}

function FactorPreviewEquation({ expression }: { expression: string }) {
  const parsed = parseLimitExpression(expression);
  const fraction = parsed ? parseFractionBody(parsed.body) : null;

  if (fraction === null) return null;

  return (
    <div className="mt-1 inline-flex items-center gap-3 rounded-2xl border border-[#FBBF24]/34 bg-[linear-gradient(180deg,rgba(251,191,36,0.18),rgba(251,191,36,0.08))] px-4 py-2 shadow-[0_0_26px_rgba(251,191,36,0.14)]">
      <span className="font-mono text-sm font-black text-yellow-100">f(x)=</span>
      <span className="inline-flex min-w-[148px] flex-col items-center justify-center text-center font-black leading-none text-white" aria-label={`${fraction.numerator} bölü ${fraction.denominator}`}>
        <span className="text-lg">{fraction.numerator}</span>
        <span className="my-1.5 h-[2px] w-full rounded-full bg-yellow-100/90 shadow-[0_0_12px_rgba(251,191,36,0.32)]" />
        <span className="text-lg">{fraction.denominator}</span>
      </span>
    </div>
  );
}

function LimitExpressionDisplay({ expression }: { expression: string }) {
  const parsed = parseLimitExpression(expression);

  if (parsed === null) {
    return <p className="mt-1 text-xl font-black tracking-tight text-white lg:text-2xl">{expression}</p>;
  }

  return (
    <div className="mt-1 inline-flex items-start justify-center gap-2 whitespace-nowrap text-white">
      <span className="relative flex w-[40px] justify-center pb-8 leading-none">
        <span className="text-xl font-black leading-none tracking-tight lg:text-2xl">lim</span>
        <span className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-2.5 py-1.5 font-mono text-sm font-black leading-none tracking-normal text-[#9AF5FF] shadow-[0_0_18px_rgba(0,229,255,0.12)] lg:top-7 lg:text-base">
          x &rarr; {parsed.target}
        </span>
      </span>
      <LimitBodyDisplay body={parsed.body} />
    </div>
  );
}

function LimitBodyDisplay({ body }: { body: string }) {
  const fraction = parseFractionBody(body);

  if (fraction === null) {
    return <span className="text-xl font-black leading-none tracking-tight lg:text-2xl">{body}</span>;
  }

  return (
    <span className="inline-flex min-w-[150px] flex-col items-center justify-center px-1 text-center align-middle font-black leading-none tracking-tight text-white lg:min-w-[172px]">
      <span className="text-xl lg:text-2xl">{fraction.numerator}</span>
      <span className="my-1 h-[2px] w-full rounded-full bg-white/86 shadow-[0_0_14px_rgba(255,255,255,0.20)]" />
      <span className="text-xl lg:text-2xl">{fraction.denominator}</span>
    </span>
  );
}

function parseLimitExpression(expression: string) {
  const match = expression.match(/^lim\s+x->(\S+)\s+(.+)$/);
  if (match === null) return null;

  return {
    target: match[1],
    body: match[2],
  };
}

function parseFractionBody(body: string) {
  const fractionMatch = body.match(/^\((.+)\)\/\((.+)\)$/);
  if (fractionMatch === null) return null;

  return {
    numerator: fractionMatch[1],
    denominator: fractionMatch[2],
  };
}

function MissionStage({ mission, tool, solved, accent, hasError }: { mission: LimitMission; tool: LimitTool | null; solved: boolean; accent: string; hasError: boolean }) {
  if (mission.sceneKind === 'factor') {
    return <FactorStage mission={mission} tool={tool} solved={solved} accent={accent} hasError={hasError} />;
  }

  if (mission.sceneKind === 'local') {
    return <LocalStage mission={mission} tool={tool} solved={solved} accent={accent} hasError={hasError} />;
  }

  return <TrackStage mission={mission} tool={tool} solved={solved} accent={accent} hasError={hasError} />;
}

function TrackStage({ mission, tool, solved, accent, hasError }: { mission: LimitMission; tool: LimitTool | null; solved: boolean; accent: string; hasError: boolean }) {
  const isInfinity = mission.sceneKind === 'infinity';
  const active = tool !== null;
  const alarm = hasError;
  const isTwoSidedGraph = mission.id === 'graph-two-sided';
  const showTwoSidedApproach = isTwoSidedGraph && (tool === 'two-sided' || solved);
  const graphAccent = alarm ? '#FF4FA3' : active ? accent : '#00E5FF';
  const sensorGlow = alarm ? 'rgba(255,79,163,0.28)' : active ? `${accent}30` : 'rgba(0,229,255,0.16)';
  const leftSensorLabel = solved ? mission.leftSensor : isInfinity ? (mission.id === 'algebra-infinity' ? 'baskın pay' : 'uzak rota') : 'soldan yaklaşma';
  const rightSensorLabel = solved ? mission.rightSensor : isInfinity ? (mission.id === 'algebra-infinity' ? 'baskın payda' : 'yatay tünel') : 'sağdan yaklaşma';
  const approachShift = isTwoSidedGraph ? 'clamp(34px, 4.5vw, 72px)' : 'clamp(96px, 12.5vw, 220px)';
  const rightApproachShift = isTwoSidedGraph ? 'calc(-1 * clamp(34px, 4.5vw, 72px))' : 'calc(-1 * clamp(96px, 12.5vw, 220px))';
  const leftApproachRise = 0;
  const rightApproachRise = 0;
  const approachEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const approachTransition = { duration: 5.6, ease: approachEase };
  const targetLineLabel = mission.id === 'graph-two-sided' ? `y = ${mission.resultBadge} yaklaşma çizgisi` : solved ? `y = ${mission.resultBadge}` : active ? 'hedef çizgi taranıyor' : 'hedef çizgi';
  const infinityLineLabel = solved ? `y = ${mission.resultBadge}` : active ? 'asimptot taranıyor' : 'yatay tünel';

  return (
    <>
      <div className="absolute inset-x-[6%] top-[31%] z-10 h-[40%] overflow-hidden rounded-[52px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,14,24,0.98),rgba(0,0,0,0.58))] shadow-[inset_0_18px_38px_rgba(0,0,0,0.72),0_26px_80px_rgba(0,0,0,0.28)]">
        <svg className="h-full w-full" viewBox="0 0 1000 360" role="img" aria-label={`${mission.title} grafik sahnesi`}>
          <defs>
            <linearGradient id={`limit-curve-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.72" />
              <stop offset="55%" stopColor={graphAccent} stopOpacity="0.96" />
              <stop offset="100%" stopColor="#B388FF" stopOpacity="0.70" />
            </linearGradient>
            <filter id={`limit-glow-${mission.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: 9 }).map((_, index) => (
            <line key={`vx-${index}`} x1={110 + index * 95} x2={110 + index * 95} y1="42" y2="318" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line key={`hy-${index}`} x1="76" x2="940" y1={76 + index * 56} y2={76 + index * 56} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}
          <line x1="88" x2="942" y1="286" y2="286" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <line x1="132" x2="132" y1="48" y2="318" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <text x="902" y="316" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">x</text>
          <text x="102" y="68" fill="rgba(255,255,255,0.42)" fontSize="18" fontWeight="800">y</text>

          {!isInfinity && (
            <>
              <line x1="508" x2="508" y1="48" y2="318" stroke={graphAccent} strokeOpacity="0.42" strokeDasharray="8 10" strokeWidth="3" />
              <line x1="88" x2="938" y1="132" y2="132" stroke={graphAccent} strokeOpacity="0.38" strokeDasharray="10 12" strokeWidth="3" />
              {mission.id === 'graph-two-sided' && (
                <>
                  <line x1="118" x2="152" y1="132" y2="132" stroke={graphAccent} strokeOpacity="0.75" strokeWidth="4" strokeLinecap="round" />
                  <text x="95" y="139" fill={graphAccent} fontSize="22" fontWeight="950">4</text>
                </>
              )}
              <path d="M90 258 C190 238 270 176 370 144 C426 126 468 122 505 132" fill="none" stroke={`url(#limit-curve-${mission.id})`} strokeWidth="8" strokeLinecap="round" filter={`url(#limit-glow-${mission.id})`} />
              <path d="M512 132 C596 134 654 164 724 205 C792 244 858 208 930 158" fill="none" stroke={`url(#limit-curve-${mission.id})`} strokeWidth="8" strokeLinecap="round" filter={`url(#limit-glow-${mission.id})`} />
              {showTwoSidedApproach && (
                <TwoSidedApproachFlow accent={graphAccent} solved={solved} />
              )}
              <circle cx="508" cy="132" r="16" fill="#02070d" stroke={graphAccent} strokeWidth="5" />
              {mission.id !== 'graph-two-sided' && (
                <text x="528" y="118" fill={graphAccent} fontSize="16" fontWeight="900">{targetLineLabel}</text>
              )}
              {mission.id !== 'graph-two-sided' && (
                <text x="532" y="306" fill="rgba(255,255,255,0.58)" fontSize="18" fontWeight="900">{mission.gateLabel}</text>
              )}
            </>
          )}

          {isInfinity && (
            <>
              <line x1="86" x2="938" y1="142" y2="142" stroke="#B388FF" strokeOpacity="0.46" strokeDasharray="12 12" strokeWidth="4" />
              <path d="M92 292 C206 264 288 194 386 166 C496 136 648 142 930 142" fill="none" stroke={`url(#limit-curve-${mission.id})`} strokeWidth="9" strokeLinecap="round" filter={`url(#limit-glow-${mission.id})`} />
              <text x="762" y="116" fill="#D8C5FF" fontSize="18" fontWeight="900">{infinityLineLabel}</text>
              <text x="716" y="168" fill="rgba(255,255,255,0.58)" fontSize="15" fontWeight="900">asimptot tüneli</text>
              <text x="510" y="306" fill="rgba(255,255,255,0.58)" fontSize="18" fontWeight="900">{mission.gateLabel}</text>
            </>
          )}
        </svg>
        {mission.id === 'graph-two-sided' && (
          <div
            className="pointer-events-none absolute left-[13%] top-[19%] z-20 rounded-full border bg-[#03111b]/92 px-3 py-1.5 font-mono text-sm font-black text-[#9AF5FF] shadow-[0_0_26px_rgba(0,229,255,0.22)] backdrop-blur-xl"
            style={{ borderColor: `${graphAccent}66` }}
          >
            y = 4 çizgisi
          </div>
        )}
      </div>

      {isInfinity && mission.id === 'algebra-infinity' && (
        <div className="absolute left-[12%] top-[34%] z-30 flex items-center gap-3 rounded-[28px] border border-[#B388FF]/30 bg-[#100827]/82 px-4 py-3 shadow-[0_16px_44px_rgba(0,0,0,0.30)] backdrop-blur-xl">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#D8C5FF]/70">baskın oran</span>
          <span className="rounded-2xl bg-white/8 px-3 py-2 text-lg font-black text-white">{mission.leftSensor}</span>
          <span className="text-white/42">/</span>
          <span className="rounded-2xl bg-white/8 px-3 py-2 text-lg font-black text-white">{mission.rightSensor}</span>
          <span className="font-black text-[#D8C5FF]">{solved ? `= ${mission.resultBadge}` : '= ?'}</span>
        </div>
      )}

      <motion.div
        className={`absolute z-30 grid place-items-center border bg-[linear-gradient(180deg,#123c50,#07131d)] shadow-[0_24px_56px_rgba(0,0,0,0.38)] ${
          isTwoSidedGraph ? 'top-[44%] h-[46px] w-[142px] rounded-full' : 'top-[43%] h-[86px] w-[172px] rounded-[28px]'
        }`}
        style={{ left: isTwoSidedGraph ? '18%' : isInfinity ? '69%' : '25%', borderColor: active ? `${accent}88` : '#00E5FF44', boxShadow: `0 24px 56px rgba(0,0,0,0.38), 0 0 36px ${sensorGlow}` }}
        animate={{ x: active ? (isInfinity ? 34 : approachShift) : 0, y: showTwoSidedApproach ? leftApproachRise : 0 }}
        transition={approachTransition}
      >
        <span className={`whitespace-nowrap px-2 text-center font-mono font-black leading-none text-white ${isTwoSidedGraph ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'}`}>{leftSensorLabel}</span>
      </motion.div>

      {!isInfinity && (
        <motion.div
          className={`absolute z-30 grid place-items-center border bg-[linear-gradient(180deg,#123c50,#07131d)] shadow-[0_24px_56px_rgba(0,0,0,0.38)] ${
            isTwoSidedGraph ? 'top-[44%] h-[46px] w-[142px] rounded-full' : 'top-[43%] h-[86px] w-[172px] rounded-[28px]'
          }`}
          style={{ right: isTwoSidedGraph ? '18%' : '25%', borderColor: active ? `${accent}88` : '#00E5FF44', boxShadow: `0 24px 56px rgba(0,0,0,0.38), 0 0 36px ${sensorGlow}` }}
          animate={{ x: active ? rightApproachShift : 0, y: showTwoSidedApproach ? rightApproachRise : 0 }}
          transition={approachTransition}
        >
          <span className={`whitespace-nowrap px-2 text-center font-mono font-black leading-none text-white ${isTwoSidedGraph ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'}`}>{rightSensorLabel}</span>
        </motion.div>
      )}

      <div
        className="absolute left-1/2 top-[51%] z-40 flex h-[106px] w-[92px] -translate-x-1/2 flex-col items-center justify-center rounded-[28px] border bg-black/52 shadow-[0_22px_52px_rgba(0,0,0,0.38)] backdrop-blur-xl"
        style={{ borderColor: alarm ? '#FF4FA388' : active ? `${accent}88` : '#00E5FF33' }}
      >
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/48">kapı</p>
        <p className="mt-1 text-xl font-black text-white lg:text-2xl">{mission.gateLabel}</p>
        <div className="mt-2 h-8 w-1 rounded-full" style={{ background: active ? `linear-gradient(180deg, ${alarm ? '#FF4FA3' : accent}, transparent)` : 'rgba(255,255,255,0.18)' }} />
      </div>

      {active && (
        <motion.div
          className="absolute left-1/2 top-[48%] z-20 h-[128px] w-[40%] -translate-x-1/2 rounded-[999px] border"
          style={{
            borderColor: alarm ? '#FF4FA377' : `${accent}66`,
            background: alarm ? 'rgba(255,79,163,0.10)' : `${accent}10`,
            boxShadow: `0 0 44px ${alarm ? '#FF4FA3' : accent}26`,
          }}
          animate={{ scaleX: solved ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
        />
      )}
    </>
  );
}

function TwoSidedApproachFlow({ accent, solved }: { accent: string; solved: boolean }) {
  const leftColor = accent;
  const rightColor = '#00FF88';
  const meetColor = '#FBBF24';
  const flowTransition = { duration: 5.8, ease: 'linear' as const, times: [0, 0.42, 0.72, 1] };

  return (
    <g aria-label="Soldan ve sağdan yaklaşma akışı">
      <motion.circle
        r="16"
        fill={leftColor}
        stroke="#02070d"
        strokeWidth="6"
        filter="url(#limit-glow-graph-two-sided)"
        animate={{ cx: [170, 306, 430, 508], cy: [242, 168, 130, 132] }}
        transition={flowTransition}
      />
      <motion.circle
        r="16"
        fill={rightColor}
        stroke="#02070d"
        strokeWidth="6"
        filter="url(#limit-glow-graph-two-sided)"
        animate={{ cx: [870, 724, 592, 508], cy: [170, 206, 142, 132] }}
        transition={flowTransition}
      />
      <motion.circle
        cx="508"
        cy="132"
        r="28"
        fill="none"
        stroke={meetColor}
        strokeWidth="5"
        strokeOpacity="0.95"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: solved ? [0.82, 0.28, 0.82] : [0, 0, 0, 0.9], scale: solved ? [1, 1.2, 1] : [0.55, 0.55, 0.55, 1] }}
        transition={{ duration: solved ? 1.8 : 5.8, repeat: solved ? Infinity : 0, ease: solved ? 'easeOut' : 'linear' }}
      />
      <motion.text
        x="392"
        y="88"
        fill={meetColor}
        fontSize="24"
        fontWeight="950"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: solved ? 1 : [0, 0, 0.92], y: solved ? 0 : [8, 8, 0] }}
        transition={{ duration: 5.8, ease: 'linear' }}
      >
        sol = sağ = 4
      </motion.text>
    </g>
  );
}

function LocalStage({ mission, tool, solved, accent, hasError }: { mission: LimitMission; tool: LimitTool | null; solved: boolean; accent: string; hasError: boolean }) {
  const active = tool !== null;
  const alarm = hasError;
  const inputValue = mission.leftSensor.replace(/^giriş\s*/i, '');
  const outputValue = solved ? mission.rightSensor.replace(/^çıkış\s*/i, '') : active ? 'işleniyor' : 'kilitli';

  return (
    <>
      <div className="absolute inset-x-[7%] top-[35%] z-10 h-[30%] rounded-[52px] border border-white/8 bg-black/40 shadow-[inset_0_18px_38px_rgba(0,0,0,0.72)]" />
      <ValueCapsule label="giriş" value={inputValue} left="18%" active={active} accent={accent} />
      <div
        className="absolute left-1/2 top-[35%] z-30 flex h-[222px] w-[310px] -translate-x-1/2 flex-col items-center justify-center rounded-[54px] border bg-[linear-gradient(180deg,#082335,#02070d)] shadow-[0_30px_72px_rgba(0,0,0,0.44)]"
        style={{ borderColor: alarm ? '#FF4FA388' : active ? `${accent}88` : '#00E5FF33' }}
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">fonksiyon makinesi</p>
        <p className="mt-4 text-5xl font-black text-white">2x + 1</p>
        <motion.div
          className="mt-5 h-3 w-44 rounded-full"
          style={{ background: active ? `linear-gradient(90deg, ${alarm ? '#FF4FA3' : accent}, transparent)` : 'rgba(255,255,255,0.14)' }}
          animate={{ opacity: active ? [0.5, 1, 0.5] : 0.5 }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </div>
      <ValueCapsule label="çıkış" value={outputValue} right="18%" active={solved} accent={accent} />
      {solved && (
        <motion.div
          className="absolute left-1/2 top-[66%] z-40 -translate-x-1/2 rounded-full border border-[#00FF88]/42 bg-[#00FF88]/14 px-8 py-3 text-lg font-black text-emerald-100"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {mission.resultLabel}
        </motion.div>
      )}
    </>
  );
}

function FactorStage({ mission, tool, solved, accent, hasError }: { mission: LimitMission; tool: LimitTool | null; solved: boolean; accent: string; hasError: boolean }) {
  const active = tool !== null;
  const alarm = hasError;
  const factorPreview = tool === 'factor';
  const revealFactorRoute = factorPreview || solved;
  const cancelGlow = solved ? 'rgba(251,191,36,0.36)' : factorPreview ? 'rgba(251,191,36,0.20)' : 'rgba(255,255,255,0.12)';

  return (
    <>
      <div className="absolute inset-x-[7%] top-[32%] z-10 h-[40%] overflow-hidden rounded-[52px] border border-white/8 bg-black/42 shadow-[inset_0_18px_38px_rgba(0,0,0,0.72)]">
        <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1000 360" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, index) => (
            <line key={`factor-grid-${index}`} x1={110 + index * 105} x2={110 + index * 105} y1="46" y2="314" stroke="rgba(255,255,255,0.045)" />
          ))}
          <line x1="120" x2="916" y1="275" y2="275" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
          <path d="M144 282 C252 248 340 194 452 158 C530 132 668 134 836 126" fill="none" stroke="rgba(251,191,36,0.34)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="604" cy="142" r="15" fill="#02070d" stroke="#FBBF24" strokeWidth="4" />
        </svg>
      </div>

      <div className="absolute left-[12%] top-[38%] z-20 flex items-center gap-3">
        <div
          className="relative rounded-[26px] border bg-[linear-gradient(135deg,#123048,#04121d)] px-4 py-3 shadow-[0_22px_50px_rgba(0,0,0,0.34)]"
          style={{ borderColor: solved || factorPreview ? '#FBBF2488' : 'rgba(255,255,255,0.12)', boxShadow: `0 22px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.14), 0 0 34px ${cancelGlow}` }}
        >
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/18" />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48">pay ortak</p>
          <p className="mt-2 text-2xl font-black text-white">(x - 2)</p>
        </div>
        <div className="relative rounded-[26px] border border-[#00E5FF]/32 bg-[linear-gradient(135deg,#123048,#04121d)] px-4 py-3 shadow-[0_22px_50px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.12)]">
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/18" />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48">{revealFactorRoute ? 'kalan ifade' : 'sonraki ifade'}</p>
          <p className="mt-2 text-2xl font-black text-white">{revealFactorRoute ? '(x + 2)' : '?'}</p>
        </div>
      </div>

      <div
        className="absolute right-[13%] top-[42%] z-20 w-[210px] rounded-[26px] border bg-[linear-gradient(135deg,#123048,#04121d)] px-4 py-3 shadow-[0_22px_50px_rgba(0,0,0,0.34)]"
        style={{ borderColor: solved || factorPreview ? '#FBBF2488' : 'rgba(255,255,255,0.12)', boxShadow: `0 22px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.14), 0 0 34px ${cancelGlow}` }}
      >
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/18" />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48">payda ortak</p>
        <p className="mt-2 text-2xl font-black text-white">{mission.rightSensor}</p>
      </div>

      <div
        className="absolute left-1/2 top-[36%] z-30 grid h-[190px] w-[190px] -translate-x-1/2 place-items-center rounded-full border bg-[radial-gradient(circle,rgba(251,191,36,0.20),rgba(0,0,0,0.62))] shadow-[0_0_70px_rgba(251,191,36,0.20)]"
        style={{ borderColor: alarm ? '#FF4FA388' : active ? `${accent}88` : '#FBBF2444' }}
      >
        <div className="text-center">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-yellow-200/70">belirsizlik</p>
          <p className="mt-2 text-5xl font-black text-white">0/0</p>
        </div>
      </div>
      {factorPreview && (
        <motion.div
          className="absolute left-1/2 top-[28%] z-50 flex h-[260px] w-[170px] -translate-x-1/2 flex-col items-center"
          initial={{ y: 34, opacity: 0, scale: 0.94 }}
          animate={{ y: solved ? [-8, -30, -8] : 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, repeat: solved ? Infinity : 0 }}
        >
          <div className="h-24 w-2 rounded-full bg-yellow-300 shadow-[0_0_28px_rgba(251,191,36,0.5)]" />
          <div className="rounded-2xl border border-yellow-300/70 bg-yellow-300/16 px-4 py-2 font-mono text-sm font-black text-yellow-100">(x - 2)</div>
        </motion.div>
      )}
      {solved && (
        <motion.div
          className="absolute left-1/2 top-[58%] z-[60] -translate-x-1/2 rounded-[30px] border border-yellow-300/56 bg-[#3a2b02]/86 px-8 py-3 text-center shadow-[0_0_40px_rgba(251,191,36,0.22)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-yellow-100/70">sade rota</p>
          <p className="mt-1 text-3xl font-black text-white">{'x + 2 -> 4'}</p>
        </motion.div>
      )}
    </>
  );
}

function ValueCapsule({ label, value, active, accent, left, right }: { label: string; value: string; active: boolean; accent: string; left?: string; right?: string }) {
  return (
    <motion.div
      className="absolute top-[43%] z-40 grid h-[124px] w-[150px] place-items-center rounded-[40px] border bg-[linear-gradient(180deg,#123c50,#07131d)] shadow-[0_24px_56px_rgba(0,0,0,0.38)]"
      style={{ left, right, borderColor: active ? `${accent}88` : '#00E5FF44' }}
      animate={{ y: active ? [-3, 2, -3] : 0 }}
      transition={{ duration: 2, repeat: active ? Infinity : 0 }}
    >
      <div className="text-center">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/48">{label}</p>
        <p className="mt-2 text-3xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );
}
