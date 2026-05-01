import { Check, MousePointer2, RotateCcw, Triangle } from 'lucide-react';
import { MissionStep } from '../shared/Grade9LabShell';
import { SciFiButton } from '../../../components/ui/SciFiButton';
import { TriangleMeasurements, VertexKey } from './types';
import { round } from './triangleGeometry';

interface TriangleControlsProps {
  mission: MissionStep;
  activeIndex: number;
  measurements: TriangleMeasurements;
  placedOrder: VertexKey[];
  missionOneOk: boolean;
  missionTwoOk: boolean;
  onCheck: () => void;
  onReset: () => void;
}

export function TriangleControls({ mission, activeIndex, measurements, placedOrder, missionOneOk, missionTwoOk, onCheck, onReset }: TriangleControlsProps) {
  return (
    <aside className="min-w-0 rounded-[30px] border border-teal-200/18 bg-black/45 p-4 backdrop-blur-xl xl:p-5">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-teal-100/55">gerilim görevi {activeIndex + 1}/2</p>
      <h3 className="mt-1 text-xl font-black text-white xl:text-2xl">{mission.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-teal-50/70">{mission.prompt}</p>

      <div className="mt-4 grid gap-3">
        <SciFiButton data-testid="triangle-check" onClick={onCheck} className="min-h-[50px]" icon={<Check className="h-4 w-4" />}>
          {activeIndex === 0 ? (missionOneOk ? 'Gerilim Kilitlendi' : 'Gerilimi Onayla') : (missionTwoOk ? '180° Tamam' : 'Rayı Onayla')}
        </SciFiButton>
        <SciFiButton data-testid="triangle-reset" variant="secondary" onClick={onReset} className="min-h-[50px]" icon={<RotateCcw className="h-4 w-4" />}>
          Sıfırla
        </SciFiButton>
      </div>

      {activeIndex === 0 ? (
        <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-3 xl:gap-3 xl:p-4">
          <MeasureRow label="Açı A" value={`${round(measurements.angles.A)}°`} active={measurements.largestAngle === 'A'} />
          <MeasureRow label="Açı B" value={`${round(measurements.angles.B)}°`} active={measurements.largestAngle === 'B'} />
          <MeasureRow label="Açı C" value={`${round(measurements.angles.C)}°`} active={measurements.largestAngle === 'C'} />
          <div className="mt-2 h-px bg-white/10" />
          <MeasureRow label="a = BC" value={String(round(measurements.sides.a))} active={measurements.longestSide === 'a'} />
          <MeasureRow label="b = AC" value={String(round(measurements.sides.b))} active={measurements.longestSide === 'b'} />
          <MeasureRow label="c = AB" value={String(round(measurements.sides.c))} active={measurements.longestSide === 'c'} />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/48">açı açma masası</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <span className="text-4xl font-black text-amber-100">{placedOrder.length}/3</span>
            <span className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 font-mono text-sm font-black text-emerald-100">
              hedef 180°
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/58">
            Kenar ölçüleri bu adımda kapalı. Sadece üç iç açının düz açıya dönüşmesini izle.
          </p>
        </div>
      )}

      <div className="mt-4 hidden rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-xs leading-relaxed text-amber-50/75 xl:block">
        {activeIndex === 0 ? (
          <>
            <MousePointer2 className="mb-2 h-4 w-4 text-amber-200" />
            C köşesini hedef halkaya sürükle. Hedef: A açısı en büyük, karşısındaki BC kenarı en uzun.
          </>
        ) : (
          <>
            <Triangle className="mb-2 h-4 w-4 text-amber-200" />
            Yerleşen açı parçası: {placedOrder.length}/3. Sıra önemli değil; üçü de rayı doldurmalı.
          </>
        )}
      </div>

    </aside>
  );
}

function MeasureRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-3 py-2 font-mono text-sm ${active ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-black/20 text-white/68'}`}>
      <span>{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
