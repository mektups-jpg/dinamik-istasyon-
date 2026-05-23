import { type PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
import { AlarmCompletion } from './AlarmCompletion';
import { AlarmControls } from './AlarmControls';
import { CornerTrack, GapTrack, getScanPoint, progressFromSvgPoint } from './AlarmTracks';
import {
  alarmMissions,
  alarmTools,
  AlarmTool,
  ATOM_IDS,
  MODULE_ID,
  scanStartForMission,
  TEST_ID_CONTRACT,
} from './derivativeNonexistentModel';

export default function DerivativeNonexistentAlarmApp() {
  const { unlockAtom, unlockModule } = useAtomStore();
  const { addScore } = useGameStore();
  const showMessage = useAstroBotStore((state) => state.showMessage);
  const clearMessage = useAstroBotStore((state) => state.clearMessage);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<AlarmTool | null>(null);
  const [scanProgress, setScanProgress] = useState(scanStartForMission(alarmMissions[0].mode));
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Grade12StageStatus>('info');
  const [feedback, setFeedback] = useState(missionAstroPrompt(alarmMissions[0].mode));

  const mission = alarmMissions[missionIndex];
  const hasNextMission = missionIndex < alarmMissions.length - 1;
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? hasNextMission
      ? 'Alarm kilitlendi. Sıradaki grafikte alarm türünü yeniden ayır.'
      : 'İki türev-yok durumu ayrıldı; Bitir ile kanıtı kapat.'
    : status === 'error'
      ? 'Alarm türünü karıştırdın. Grafiğe tekrar bak: sivri uç mu, kopukluk mu?'
      : selectedTool === null
        ? mission.mode === 'corner'
          ? 'Önce alarmı seç: iki eğim tek teğette birleşiyor mu?'
          : 'Önce alarmı seç: grafik x=2 noktasında kesintisiz mi?'
        : 'Tarayıcıyı oynat, sonra alarmı test et.';

  useEffect(() => {
    if (completed) return;
    showMessage(missionAstroPrompt(mission.mode), 'info');
  }, [completed, mission.mode, showMessage]);

  const chooseTool = (tool: AlarmTool) => {
    setSelectedTool(tool);
    setSolved(false);
    setStatus('info');
    setFeedback(toolFeedback(tool));
    showMessage(toolAstroHint(tool), 'info');
  };

  const updateScan = (nextProgress: number) => {
    setScanProgress(nextProgress);
    setSolved(false);
    setStatus('info');
    setFeedback('Tarayıcı sahnede ilerliyor; alarmı grafiğin davranışından oku.');
  };

  const checkAnswer = () => {
    if (selectedTool === null) {
      setStatus('error');
      setSolved(false);
      setFeedback('Önce alarm türünü seç: sivri uç mu, kopuk pist mi?');
      showMessage('Önce alarm türünü seçelim; sonra grafikte nedenini okuyacağız.', 'error');
      return;
    }

    if (selectedTool !== mission.expectedTool) {
      setStatus('error');
      setSolved(false);
      setFeedback(mission.failure[selectedTool]);
      showMessage(mission.failure[selectedTool], 'error');
      return;
    }

    setStatus('success');
    setSolved(true);
    setFeedback(mission.success);
    showMessage(mission.success, 'success');
  };

  const nextMission = () => {
    if (missionIndex === alarmMissions.length - 1) {
      ATOM_IDS.forEach((atomId) => unlockAtom(atomId));
      unlockModule(MODULE_ID);
      addScore(100);
      setCompleted(true);
      clearMessage();
      showMessage('Türev yok alarm istasyonu tamamlandı: sivri uç ve kopuk grafik ayrı ayrı kilitlendi.', 'success');
      return;
    }

    const nextIndex = missionIndex + 1;
    const nextMissionItem = alarmMissions[nextIndex];
    setMissionIndex(nextIndex);
    setSelectedTool(null);
    setScanProgress(scanStartForMission(nextMissionItem.mode));
    setSolved(false);
    setStatus('info');
    setFeedback(missionAstroPrompt(nextMissionItem.mode));
    clearMessage();
  };

  const reset = () => {
    const firstMission = alarmMissions[0];
    setMissionIndex(0);
    setSelectedTool(null);
    setScanProgress(scanStartForMission(firstMission.mode));
    setSolved(false);
    setCompleted(false);
    setStatus('info');
    setFeedback(missionAstroPrompt(firstMission.mode));
    clearMessage();
    showMessage('Türev yok alarmı sıfırlandı. Önce sivri uç noktasına bak.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Türev Yok Alarm İstasyonu"
      subtitle="MAT.12.2.4.3-4"
      statusLabel="Showcase Ready"
      eyebrow="12. sınıf vitrin modülü"
      panelTitle="Alarm kontrolü"
      astroBotMessage={astroBotMessage}
      moduleId={MODULE_ID}
      atomIds={atomIds}
      completed={completed}
      completedTitle="TÜREV YOK ALARMI TAMAMLANDI"
      completedMessage="Sivri uç ve kopuk grafikte türevin neden kurulamadığı ayrı sahnelerde kanıtlandı."
      scoreEarned={100}
      completion={<AlarmCompletion onRestart={reset} />}
      onReset={reset}
      onRestart={reset}
      status={status}
      feedback={feedback}
      stage={
        <AlarmScene
          missionIndex={missionIndex}
          selectedTool={selectedTool}
          scanProgress={scanProgress}
          solved={solved}
          status={status}
          onScanChange={updateScan}
        />
      }
      dock={
        <>
          <TestIdContractMarker />
          <AlarmControls
            missionIndex={missionIndex}
            selectedTool={selectedTool}
            solved={solved}
            status={status}
            onToolChange={chooseTool}
            onCheck={checkAnswer}
            onNext={nextMission}
          />
        </>
      }
    />
  );
}

interface AlarmSceneProps {
  missionIndex: number;
  selectedTool: AlarmTool | null;
  scanProgress: number;
  solved: boolean;
  status: Grade12StageStatus;
  onScanChange: (nextProgress: number) => void;
}

function AlarmScene({ missionIndex, selectedTool, scanProgress, solved, status, onScanChange }: AlarmSceneProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingScanner, setDraggingScanner] = useState(false);
  const mission = alarmMissions[missionIndex];
  const accent = selectedTool ? alarmTools[selectedTool].accent : mission.mode === 'corner' ? '#FBBF24' : '#FF4FA3';
  const scanPoint = getScanPoint(mission.mode, scanProgress);
  const targetX = mission.mode === 'corner' ? 500 : 500;
  const isGap = mission.mode === 'gap';
  const proofLabel = isGap ? 'kopukluk tarayıcısı' : 'teğet tarayıcısı';
  const scannerHint = isGap ? 'Boşluğu sahnede tara' : 'Noktayı sahnede tara';

  const updateScannerFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const transform = svg?.getScreenCTM();
    if (!svg || !transform) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(transform.inverse());
    onScanChange(progressFromSvgPoint(mission.mode, svgPoint));
  };

  const handleScannerPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingScanner(true);
    updateScannerFromPointer(event);
  };

  const handleScannerPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggingScanner) return;
    updateScannerFromPointer(event);
  };

  const handleScannerPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggingScanner(false);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 py-4 lg:px-7">
      <div className="absolute left-1/2 top-5 z-20 flex w-[min(88%,820px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/12 bg-black/40 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/48">aktif istasyon</p>
          <p className="truncate text-base font-black text-white">{mission.sceneTitle}</p>
        </div>
        <span
          className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
          style={{ borderColor: `${accent}66`, color: accent, background: `${accent}16` }}
        >
          {solved ? 'alarm kilitlendi' : isGap ? 'süreklilik kontrolü' : 'teğet kontrolü'}
        </span>
      </div>

      <motion.div
        layout
        className="relative mt-6 h-[min(76vh,660px)] w-[min(95vw,1280px)] overflow-hidden rounded-[38px] border border-[#00E5FF]/24 bg-[#020913] shadow-[0_0_96px_rgba(0,229,255,0.16),0_42px_120px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_16%,rgba(0,229,255,0.18),transparent_34%),radial-gradient(circle_at_48%_72%,rgba(0,255,136,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.07),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-10 bottom-9 h-24 rounded-full bg-[#00E5FF]/8 blur-3xl" />
        <svg
          ref={svgRef}
          className={`absolute inset-0 h-full w-full touch-none ${draggingScanner ? 'cursor-grabbing' : 'cursor-crosshair'}`}
          viewBox="0 0 1000 520"
          role="img"
          aria-label={mission.sceneTitle}
          onPointerDown={handleScannerPointerDown}
          onPointerMove={handleScannerPointerMove}
          onPointerUp={handleScannerPointerUp}
          onPointerCancel={handleScannerPointerUp}
        >
          <defs>
            <filter id={`alarm-glow-${mission.id}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`alarm-track-${mission.id}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
            <linearGradient id={`alarm-floor-${mission.id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,229,255,0.20)" />
              <stop offset="100%" stopColor="rgba(0,255,136,0.02)" />
            </linearGradient>
          </defs>

          <g opacity="0.12">
            {Array.from({ length: 6 }, (_, index) => (
              <line key={`h-${index}`} x1="70" x2="930" y1={120 + index * 58} y2={120 + index * 58} stroke="#8CEBFF" strokeWidth="1" />
            ))}
            {Array.from({ length: 7 }, (_, index) => (
              <line key={`v-${index}`} x1={110 + index * 130} x2={110 + index * 130} y1="82" y2="418" stroke="#8CEBFF" strokeWidth="1" />
            ))}
          </g>
          <g opacity="0.32">
            <line x1="96" x2="928" y1="400" y2="400" stroke="#B8F7FF" strokeWidth="2" />
            <line x1="120" x2="120" y1="98" y2="414" stroke="#B8F7FF" strokeWidth="2" />
            <text x="912" y="390" fill="#B8F7FF" fontSize="18" fontWeight="900">x</text>
            <text x="134" y="116" fill="#B8F7FF" fontSize="18" fontWeight="900">y</text>
          </g>
          <ellipse cx="500" cy="400" rx="405" ry="82" fill={`url(#alarm-floor-${mission.id})`} opacity="0.54" />
          <ellipse cx="500" cy="404" rx="360" ry="38" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.12" />

          {isGap ? (
            <GapTrack accent={accent} solved={solved} scanProgress={scanProgress} />
          ) : (
            <CornerTrack accent={accent} solved={solved} scanProgress={scanProgress} />
          )}

          <motion.line
            x1={targetX}
            x2={targetX}
            y1="74"
            y2="426"
            stroke={accent}
            strokeDasharray="10 12"
            strokeWidth="3"
            initial={false}
            animate={{ opacity: status === 'success' ? 0.9 : 0.54 }}
          />

          <motion.g
            filter={`url(#alarm-glow-${mission.id})`}
            className={draggingScanner ? 'cursor-grabbing' : 'cursor-grab'}
            initial={false}
            animate={{ x: scanPoint.x, y: scanPoint.y }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          >
            <circle r="42" fill={accent} opacity="0.10" />
            <circle r="24" fill="#04111f" stroke={accent} strokeWidth="7" />
            <circle r="8" fill={accent} />
            <text y="-36" textAnchor="middle" fill={accent} fontFamily="monospace" fontSize="10" fontWeight="900">
              SÜRÜKLE
            </text>
          </motion.g>

        </svg>

        <div className="absolute bottom-7 right-8 z-20 w-[min(34%,360px)] rounded-[22px] border border-white/12 bg-black/66 p-3 shadow-[0_20px_54px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>
                {proofLabel}
              </p>
              <p className="mt-1 truncate text-sm font-black text-white">{scannerHint}</p>
            </div>
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border bg-black/30 font-mono text-lg font-black"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              {selectedTool ? alarmTools[selectedTool].short : '?'}
            </div>
          </div>
          <input
            data-testid={`${MODULE_ID}-manipulator`}
            aria-label="Alarm tarayıcısını hareket ettir"
            type="range"
            min="0"
            max="100"
            value={Math.round(scanProgress * 100)}
            onChange={(event) => onScanChange(Number(event.target.value) / 100)}
            className="mt-4 h-3 w-full cursor-pointer accent-[#00E5FF]"
          />
        </div>
      </motion.div>
    </div>
  );
}

function missionAstroPrompt(mode: 'corner' | 'gap') {
  return mode === 'corner'
    ? "x=2'de sivri uç var. Sol ve sağ eğim aynı yöne mi gidiyor?"
    : "x=2'de grafik kopuyor. Önce kesintisizlik var mı?";
}

function toolAstroHint(tool: AlarmTool) {
  return tool === 'corner'
    ? 'Sivri uçta iki yandan gelen teğet yönlerini karşılaştır.'
    : "Kopuk grafikte x=2 çevresinde çizgi kesiliyor mu, ona bak.";
}

function toolFeedback(tool: AlarmTool) {
  return tool === 'corner'
    ? 'Sivri uç seçildi; sol ve sağ eğim yönlerini karşılaştır.'
    : 'Kopuk grafik seçildi; x=2 çevresindeki kesintiyi tara.';
}

function TestIdContractMarker() {
  return <span className="sr-only">{TEST_ID_CONTRACT.join(' ')}</span>;
}
