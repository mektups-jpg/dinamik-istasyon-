import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import type { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { TerrainMachine } from './OptimizationTerrainMachine';
import {
  isOptimizationCorrect,
  MODULE_ID,
  toolCopy,
} from './optimizationTerrainModel';
import type { OptimizationMission, OptimizationTool } from './optimizationTerrainModel';

interface OptimizationTerrainSceneProps {
  mission: OptimizationMission;
  tool: OptimizationTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

const neutralAccent = '#00E5FF';

export function OptimizationTerrainScene({ mission, tool, solved, status, onHome }: OptimizationTerrainSceneProps) {
  const selected = tool ? toolCopy[tool] : null;
  const toolMatches = isOptimizationCorrect(mission, tool);
  const checked = status === 'success' || status === 'error';
  const checkedCorrect = checked && toolMatches;
  const accent = selected?.accent ?? neutralAccent;
  const statusLabel = solved
    ? 'Karar kilitlendi'
    : tool === null
      ? 'Arazi bekliyor'
      : checkedCorrect
        ? 'Doğru karar çalışıyor'
        : status === 'error'
          ? 'Yanlış karar alarmı'
          : 'Karar önizlemede';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onHome();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_38%_30%,rgba(0,229,255,0.20),transparent_38%),radial-gradient(circle_at_74%_62%,rgba(0,255,136,0.16),transparent_32%),radial-gradient(circle_at_52%_82%,rgba(251,191,36,0.10),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,229,255,0.065)_0_1px,transparent_1px_96px)] opacity-70" />

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
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/42">aktif arazi</p>
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

          <div className="absolute inset-x-[1%] top-[7%] h-[88%] rounded-[60px] border border-[#00E5FF]/16 bg-[linear-gradient(180deg,rgba(8,30,50,0.94),rgba(3,17,27,0.68)_58%,rgba(1,7,14,0.92))] shadow-[0_54px_130px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.16)]" />

          <div className="absolute left-1/2 top-[11%] z-20 -translate-x-1/2 rounded-[24px] border border-[#00E5FF]/20 bg-[#03111b]/92 px-5 py-2.5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/70">
              {solved ? 'optimizasyon kanıtı' : 'sensör okuması'}
            </p>
            <p className="mt-1 text-lg font-black tracking-tight text-white lg:text-xl">{solved ? mission.formula : mission.sensor}</p>
          </div>

          <TerrainMachine mission={mission} tool={tool} solved={solved} status={status} accent={accent} checkedCorrect={checkedCorrect} />

          {tool !== null && (
            <motion.div
              className="absolute left-1/2 top-[74%] z-50 flex w-[min(66%,720px)] -translate-x-1/2 items-center justify-between gap-4 rounded-[28px] border bg-[#041725]/98 px-5 py-3 shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
              style={{ borderColor: status === 'error' ? '#FF4FA355' : `${accent}66` }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: status === 'error' ? '#FF8ABB' : accent }}>
                  {status === 'error' ? 'alarm' : solved ? 'arazi kanıtı' : 'seçilen karar'}
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
