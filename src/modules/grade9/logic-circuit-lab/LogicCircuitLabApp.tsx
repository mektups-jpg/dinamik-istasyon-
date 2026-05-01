import { useState } from 'react';
import { Grade9LabShell, MissionStep, useGrade9MissionProgress } from '../shared/Grade9LabShell';
import { CircuitControls } from './CircuitControls';
import { CircuitScene } from './CircuitScene';
import { CircuitInputs } from './types';
import { evaluateGate, gateTargets, isTargetMatched } from './circuitModel';

const MODULE_ID = 'logic-circuit-lab';

const ATOM_IDS = gateTargets.map((target) => target.atomId);

const MISSIONS: MissionStep[] = [
  {
    id: 'and-gate',
    title: 'VE Kapısı: Çift Anahtar',
    atomId: 'MAT.9.3.2.1',
    prompt: 'A ve B anahtarlarını aç. VE kapısında çıkış yalnız 1-1 durumunda yanmalı.',
  },
  {
    id: 'or-gate',
    title: 'VEYA Kapısı: Tek Sönük Durum',
    atomId: 'MAT.9.3.2.2',
    prompt: 'İki anahtarı da kapat. VEYA kapısının söndüğü tek durum 0-0 olmalı.',
  },
  {
    id: 'implies-gate',
    title: 'İSE Kapısı: 100 Hatası',
    atomId: 'MAT.9.3.2.3',
    prompt: 'A=1, B=0 yap. İSE kapısının tek hata durumunu devrede gör.',
  },
  {
    id: 'xor-gate',
    title: 'YA DA Kapısı: Tek Sinyal',
    atomId: 'MAT.9.3.2.4',
    prompt: 'Yalnız bir anahtar açık kalsın. YA DA kapısı farklı girişlerde yanar.',
  },
];

export default function LogicCircuitLabApp() {
  const progress = useGrade9MissionProgress({ moduleId: MODULE_ID, missions: MISSIONS, completionAtomIds: ATOM_IDS });
  const [inputs, setInputs] = useState<CircuitInputs>({ a: false, b: false });
  const activeIndex = progress.activeIndex;
  const target = gateTargets[activeIndex];
  const output = evaluateGate(target.gate, inputs);
  const missionOk = isTargetMatched(target, inputs);

  const resetPanel = () => {
    setInputs({ a: false, b: false });
  };

  const restart = () => {
    resetPanel();
    progress.restart();
  };

  const setInput = (key: keyof CircuitInputs, value: boolean) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  const handleCheck = () => {
    progress.submitMission({
      ok: missionOk,
      success: 'Kapı davranışı doğru okundu. Sıradaki kartuş devreye giriyor.',
      error: `${target.label} hedef duruma gelmedi. A/B anahtarlarını hedef kurala göre yeniden ayarla.`,
    });
  };

  return (
    <Grade9LabShell
      title="Akıllı Mantık Devreleri"
      subtitle="MAT.9.3.2.x"
      moduleId={MODULE_ID}
      missions={MISSIONS}
      activeIndex={activeIndex}
      completed={progress.completed}
      onRestart={restart}
      contentClassName="max-w-4xl overflow-x-hidden px-4 py-5 sm:px-0 xl:max-w-6xl"
      frameClassName="bg-[#03080f] [background-image:radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(0,255,136,0.10),transparent_26%),linear-gradient(180deg,#03080f_0%,#07121f_58%,#03060b_100%)]"
      badges={[
        { label: 'Kapı', value: target.label, tone: 'cyan' },
        { label: 'Çıkış', value: output ? '1' : '0', tone: output ? 'green' : 'pink' },
      ]}
    >
      <div className="grid min-h-0 min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <CircuitScene
          inputs={inputs}
          target={target}
          output={output}
          missionOk={missionOk}
        />
        <CircuitControls
          mission={progress.activeMission}
          activeIndex={activeIndex}
          inputs={inputs}
          target={target}
          output={output}
          missionOk={missionOk}
          setInput={setInput}
          onCheck={handleCheck}
          onReset={resetPanel}
        />
      </div>
    </Grade9LabShell>
  );
}
