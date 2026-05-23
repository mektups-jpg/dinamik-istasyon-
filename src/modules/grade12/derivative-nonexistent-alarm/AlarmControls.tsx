import { motion } from 'motion/react';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { alarmMissions, alarmTools, AlarmTool, MODULE_ID } from './derivativeNonexistentModel';

interface AlarmControlsProps {
  missionIndex: number;
  selectedTool: AlarmTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onToolChange: (tool: AlarmTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

export function AlarmControls({ missionIndex, selectedTool, solved, status, onToolChange, onCheck, onNext }: AlarmControlsProps) {
  const mission = alarmMissions[missionIndex];
  const hasNextMission = missionIndex < alarmMissions.length - 1;
  const checkClass = status === 'success'
    ? 'border-[#00FF88]/34 bg-[#00FF88]/18 text-emerald-100'
    : status === 'error'
      ? 'border-[#FF4FA3]/30 bg-[#FF4FA3]/14 text-pink-100'
      : 'border-white/12 bg-white/[0.07] text-white/82';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2 overflow-x-hidden overflow-y-auto pr-1">
      <div className="shrink-0 rounded-[22px] border border-white/10 bg-white/[0.06] p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#00E5FF]/72">
            görev {missionIndex + 1} / {alarmMissions.length}
          </p>
          <div className="flex gap-1">
            {alarmMissions.map((item, index) => (
              <span
                key={item.id}
                className={`h-1.5 w-6 rounded-full ${index <= missionIndex ? 'bg-[#00E5FF]' : 'bg-white/18'}`}
              />
            ))}
          </div>
        </div>
        <h3 className="mt-2 text-base font-black text-white">{mission.title}</h3>
        <p className="mt-1 text-xs font-bold leading-snug text-white/68">{missionPanelCue(mission.mode)}</p>
      </div>

      <div className="grid shrink-0 gap-2">
        {(Object.keys(alarmTools) as AlarmTool[]).map((tool) => {
          const item = alarmTools[tool];
          const isActive = selectedTool === tool;
          return (
            <motion.button
              key={tool}
              type="button"
              data-testid={`${MODULE_ID}-${tool}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToolChange(tool)}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-left transition ${
                isActive
                  ? 'border-[#00E5FF]/58 bg-[#00E5FF]/16 text-cyan-50 shadow-[0_0_22px_rgba(0,229,255,0.12)]'
                  : 'border-white/12 bg-white/[0.07] text-white/74 hover:border-[#00E5FF]/28 hover:text-cyan-100'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">{item.label}</span>
                <span className="mt-1 block text-xs font-bold leading-snug text-white/58">{toolPanelDescription(tool)}</span>
              </span>
              <span
                className="grid h-8 w-9 place-items-center rounded-xl border bg-black/22 font-mono text-sm"
                style={{ borderColor: `${item.accent}55`, color: item.accent }}
              >
                {item.short}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto grid shrink-0 gap-2">
        <motion.button
          type="button"
          data-testid={`${MODULE_ID}-check`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={solved ? onNext : onCheck}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${checkClass}`}
        >
          {solved ? (hasNextMission ? 'Sıradaki Alarm' : 'Bitir') : 'Alarmı Test Et'}
        </motion.button>
      </div>
    </div>
  );
}

function missionPanelCue(mode: 'corner' | 'gap') {
  return mode === 'corner'
    ? 'Sol ve sağ eğim aynı teğeti veriyor mu?'
    : 'Grafik x=2 noktasında kesintisiz mi?';
}

function toolPanelDescription(tool: AlarmTool) {
  return tool === 'corner' ? 'İki eğim yönü' : 'Kesintisizlik kontrolü';
}
