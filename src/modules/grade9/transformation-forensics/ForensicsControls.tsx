import { Check, Crosshair, RotateCcw, ScanSearch } from 'lucide-react';
import { motion } from 'motion/react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { AxisChoice, GraphPoint } from './types';
import { axisLabel, formatPoint, targetAngle, targetAxis, targetCenter } from './forensicsModel';

interface ForensicsControlsProps {
  mission: MissionStep;
  activeIndex: number;
  center: GraphPoint;
  angle: number;
  axis: AxisChoice;
  missionOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function ForensicsControls({ mission, activeIndex, center, angle, axis, missionOk, onCheck, onReset }: ForensicsControlsProps) {
  return (
    <aside
      data-testid="transform-control-panel"
      className="relative min-w-0 overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.065] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl xl:p-5"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-cyan-200/10 blur-3xl" />

      <div className="relative">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/45">adli dosya {activeIndex + 1}/3</p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-white xl:text-2xl">{mission.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/62">{mission.prompt}</p>
        <StageProgress activeIndex={activeIndex} />
      </div>

      <div className="relative mt-4 grid gap-3 rounded-[24px] border border-white/10 bg-black/18 p-3 shadow-inner shadow-black/20">
        <LiveMetric label={activeIndex === 0 ? 'aktif merkez' : activeIndex === 1 ? 'aktif açı' : 'aktif eksen'} value={activeValue(activeIndex, center, angle, axis)} />
        <LiveMetric label="hedef" value={targetValue(activeIndex)} tone="target" />
        <motion.div
          layout
          className={`rounded-[20px] border px-4 py-3 text-sm font-black leading-snug ${
            missionOk
              ? 'border-emerald-300/28 bg-emerald-300/[0.105] text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.14)]'
              : 'border-white/10 bg-white/[0.055] text-white/76'
          }`}
        >
          {missionOk ? 'İz çakıştı. Onayla.' : instruction(activeIndex)}
        </motion.div>
      </div>

      <div className="relative mt-4 grid gap-3">
        <SciFiButton data-testid="transform-check" onClick={onCheck} className="min-h-[52px] rounded-[18px] shadow-[0_18px_42px_rgba(0,229,255,0.16)]" icon={<Check className="h-4 w-4" />}>
          İzi Onayla
        </SciFiButton>
        <SciFiButton data-testid="transform-reset" variant="secondary" onClick={onReset} className="min-h-[50px] rounded-[18px] border-white/10 bg-white/[0.055] text-white/82 hover:bg-white/[0.09]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      <div className="relative mt-4 hidden rounded-[22px] border border-cyan-100/12 bg-cyan-50/[0.055] p-4 text-xs leading-relaxed text-cyan-50/66 xl:block">
        {activeIndex === 2 ? <ScanSearch className="mb-2 h-4 w-4 text-cyan-200" /> : <Crosshair className="mb-2 h-4 w-4 text-cyan-200" />}
        Bu modülde kural ezberlenmez; hayalet şekil hedef iz ile çakışınca dönüşümün merkezi, açısı veya ekseni görünür hale gelir.
      </div>
    </aside>
  );
}

function LiveMetric({ label, value, tone = 'live' }: { label: string; value: string; tone?: 'live' | 'target' }) {
  return (
    <div className={`rounded-[20px] border px-4 py-3 ${tone === 'target' ? 'border-amber-200/18 bg-amber-100/[0.075] text-amber-50' : 'border-white/10 bg-white/[0.06] text-white'}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-65">{label}</p>
      <p className="mt-1 font-mono text-lg font-black">{value}</p>
    </div>
  );
}

function StageProgress({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {[0, 1, 2].map((step) => (
        <div
          key={step}
          className={`h-1.5 rounded-full transition-colors ${step <= activeIndex ? 'bg-cyan-200 shadow-[0_0_16px_rgba(125,211,252,0.34)]' : 'bg-white/12'}`}
        />
      ))}
    </div>
  );
}

function activeValue(activeIndex: number, center: GraphPoint, angle: number, axis: AxisChoice) {
  if (activeIndex === 0) return formatPoint(center);
  if (activeIndex === 1) return `${Math.round(angle)}°`;
  return axisLabel(axis);
}

function targetValue(activeIndex: number) {
  if (activeIndex === 0) return formatPoint(targetCenter);
  if (activeIndex === 1) return `${targetAngle}°`;
  return axisLabel(targetAxis);
}

function instruction(activeIndex: number) {
  if (activeIndex === 0) return 'Sarı merkez işaretini orijine sürükle.';
  if (activeIndex === 1) return 'Mor açı kolunu 90° hedef noktasına çevir.';
  return 'Sahnedeki ayna çizgisini seç; doğru eksende hayalet kilitlenir.';
}
