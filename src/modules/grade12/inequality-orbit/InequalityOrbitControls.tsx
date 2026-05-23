import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MODULE_ID, OrbitMission, OrbitScanner, scannerCopy } from './inequalityOrbitModel';

interface InequalityOrbitControlsProps {
  mission: OrbitMission;
  missionIndex: number;
  missionCount: number;
  scanner: OrbitScanner | null;
  solved: boolean;
  onScannerChange: (scanner: OrbitScanner) => void;
  onCheck: () => void;
  onNext: () => void;
}

const scannerOrder: OrbitScanner[] = ['roots', 'forbidden', 'positive', 'negative', 'solution'];

export function InequalityOrbitControls({
  mission,
  missionIndex,
  missionCount,
  scanner,
  solved,
  onScannerChange,
  onCheck,
  onNext,
}: InequalityOrbitControlsProps) {
  const checkLabel = scanner === null ? 'Önce Tarayıcı Seç' : 'Yörüngeyi Kilitle';
  const checkClass = scanner === null
    ? 'border-white/12 bg-white/[0.055] text-white/58 hover:border-[#00E5FF]/34 hover:text-cyan-100'
    : 'border-[#00FF88]/24 bg-[#00FF88]/12 text-emerald-100 hover:border-[#00FF88]/42';

  return (
    <div className="flex h-full min-w-0 flex-col gap-3 overflow-hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/66">görev {missionIndex + 1}/{missionCount}</p>
          <div className="flex gap-1">
            {Array.from({ length: missionCount }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-5 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/12'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-white">{mission.title}</p>
        <p className="mt-1 text-xs font-bold leading-snug text-white/62">{mission.prompt}</p>
      </div>

      <div className="space-y-2">
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/42 lg:block">Hangi tarayıcı çalışmalı?</p>
        <div className="grid grid-cols-2 gap-2">
          {scannerOrder.map((key) => (
            <ScannerButton
              key={key}
              active={scanner === key}
              scanner={key}
              onClick={() => onScannerChange(key)}
            >
              {scannerCopy[key].label}
            </ScannerButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1">
        {solved ? (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#00FF88]/24 bg-[#00FF88]/14 px-4 text-sm font-black text-emerald-100 transition hover:border-[#00FF88]/42"
          >
            <ArrowRight className="h-4 w-4" />
            {missionIndex === missionCount - 1 ? 'Bitir' : 'Sonraki'}
          </motion.button>
        ) : (
          <motion.button
            type="button"
            data-testid={`${MODULE_ID}-check`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCheck}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${checkClass}`}
          >
            <Check className="h-4 w-4" />
            {checkLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ScannerButton({ scanner, active, onClick, children }: { scanner: OrbitScanner; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      data-testid={`${MODULE_ID}-${scanner}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-11 rounded-2xl border px-3 text-sm font-black transition ${
        active
          ? 'border-[#00E5FF]/72 bg-[linear-gradient(180deg,rgba(0,229,255,0.24),rgba(0,229,255,0.10))] text-white shadow-[0_0_30px_rgba(0,229,255,0.22)]'
          : 'border-white/10 bg-white/[0.055] text-white/66 hover:border-white/24 hover:text-white'
      }`}
    >
      {children}
    </motion.button>
  );
}
