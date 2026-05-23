import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Home, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAtomStore } from '../../../store/useAtomStore';
import { useAstroBotStore } from '../../../store/useAstroBotStore';
import { useGameStore } from '../../../store/useGameStore';
import { Grade12FullStageLab, Grade12StageStatus } from '../shared/Grade12FullStageLab';
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
  const [feedback, setFeedback] = useState(alarmMissions[0].prompt);

  const mission = alarmMissions[missionIndex];
  const hasNextMission = missionIndex < alarmMissions.length - 1;
  const atomIds = useMemo(() => [...ATOM_IDS], []);
  const astroBotMessage = solved
    ? hasNextMission
      ? 'Alarm doğru: sıradaki grafikte bu kez kopukluk mu, sivri uç mu dikkatle ayır.'
      : 'İki türev-yok durumu ayrıldı; Bitir ile kanıtı kapat.'
    : selectedTool === null
      ? mission.prompt
      : status === 'error'
        ? 'Alarm türünü karıştırdın. Grafikte kopukluk mu var, yoksa sivri uçta iki farklı eğim mi var?'
        : alarmTools[selectedTool].hint;

  useEffect(() => {
    if (completed) return;
    showMessage(mission.prompt, 'info');
  }, [completed, mission.prompt, showMessage]);

  const chooseTool = (tool: AlarmTool) => {
    setSelectedTool(tool);
    setSolved(false);
    setStatus('info');
    setFeedback(alarmTools[tool].hint);
    showMessage(alarmTools[tool].hint, 'info');
  };

  const updateScan = (nextProgress: number) => {
    setScanProgress(nextProgress);
    setSolved(false);
    setStatus('info');
    setFeedback('Tarayıcıyı kritik noktaya yaklaştır: alarm gerçekten grafiğin davranışından mı çıkıyor?');
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
    setFeedback(nextMissionItem.prompt);
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
    setFeedback(firstMission.prompt);
    clearMessage();
    showMessage('Türev yok alarmı sıfırlandı. Önce sivri uç grafiğini incele.', 'info');
  };

  return (
    <Grade12FullStageLab
      title="Türev Yok Alarm İstasyonu"
      subtitle="MAT.12.2.4.3-4"
      statusLabel="Review Needed"
      eyebrow="12. sınıf kalite adayı"
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
  const mission = alarmMissions[missionIndex];
  const accent = selectedTool ? alarmTools[selectedTool].accent : mission.mode === 'corner' ? '#FBBF24' : '#FF4FA3';
  const scanPoint = getScanPoint(mission.mode, scanProgress);
  const targetX = mission.mode === 'corner' ? 500 : 500;
  const isGap = mission.mode === 'gap';

  return (
    <div className="relative flex h-full w-full items-center justify-center px-5 py-5 lg:px-8">
      <div className="absolute left-1/2 top-7 z-20 flex w-[min(86%,780px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/12 bg-black/38 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/48">aktif istasyon</p>
          <p className="truncate text-base font-black text-white">{mission.sceneTitle}</p>
        </div>
        <span
          className="shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em]"
          style={{ borderColor: `${accent}66`, color: accent, background: `${accent}16` }}
        >
          {solved ? 'alarm kilitlendi' : mission.badge}
        </span>
      </div>

      <motion.div
        layout
        className="relative mt-10 h-[min(72vh,620px)] w-[min(92vw,1220px)] overflow-hidden rounded-[34px] border border-[#00E5FF]/24 bg-[#020913] shadow-[0_0_80px_rgba(0,229,255,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_18%,rgba(0,229,255,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
        <div className="pointer-events-none absolute left-1/2 top-5 z-20 flex w-[min(86%,720px)] -translate-x-1/2 items-center justify-between gap-4 rounded-[24px] border border-white/12 bg-black/50 px-5 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
              karar kanıtı
            </p>
            <p className="mt-1 text-sm font-black leading-snug text-white">
              {mission.mode === 'corner'
                ? 'Soldan eğim ve sağdan eğim aynı çizgide birleşirse türev vardır.'
                : 'Türevden önce grafik x=2 noktasında kesintisiz olmalıdır.'}
            </p>
          </div>
          <span
            className="shrink-0 rounded-2xl border bg-black/28 px-3 py-2 font-mono text-sm font-black"
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            {mission.mode === 'corner' ? 'sol ≠ sağ' : 'kopukluk'}
          </span>
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" role="img" aria-label={mission.sceneTitle}>
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
          </defs>

          <g opacity="0.24">
            {Array.from({ length: 6 }, (_, index) => (
              <line key={`h-${index}`} x1="70" x2="930" y1={120 + index * 58} y2={120 + index * 58} stroke="#8CEBFF" strokeWidth="1" />
            ))}
            {Array.from({ length: 7 }, (_, index) => (
              <line key={`v-${index}`} x1={110 + index * 130} x2={110 + index * 130} y1="82" y2="418" stroke="#8CEBFF" strokeWidth="1" />
            ))}
          </g>

          {isGap ? (
            <GapTrack accent={accent} solved={solved} />
          ) : (
            <CornerTrack accent={accent} solved={solved} />
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
            initial={false}
            animate={{ x: scanPoint.x, y: scanPoint.y }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          >
            <circle r="24" fill="#04111f" stroke={accent} strokeWidth="7" />
            <circle r="8" fill={accent} />
          </motion.g>

          <motion.g initial={false} animate={{ x: scanPoint.x - 72, y: scanPoint.y - 86 }}>
            <rect width="144" height="48" rx="18" fill="#020913" stroke={accent} strokeWidth="2" opacity="0.94" />
            <text x="72" y="20" textAnchor="middle" fill={accent} fontFamily="monospace" fontSize="10" fontWeight="900">
              tarayıcı
            </text>
            <text x="72" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">
              {scanLabel(mission.mode, scanProgress)}
            </text>
          </motion.g>
        </svg>

        <div className="absolute bottom-7 left-1/2 z-20 w-[min(84%,660px)] -translate-x-1/2 rounded-[28px] border border-white/12 bg-black/58 p-4 shadow-[0_20px_54px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>
                alarm tarayıcısı
              </p>
              <p className="mt-1 truncate text-sm font-black text-white">{mission.sceneSummary}</p>
            </div>
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border bg-black/30 font-mono text-xl font-black"
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

function CornerTrack({ accent, solved }: { accent: string; solved: boolean }) {
  return (
    <g>
      <path d="M 190 360 L 500 170 L 810 360" fill="none" stroke={`url(#alarm-track-sharp-corner)`} strokeWidth="18" strokeLinecap="round" opacity="0.98" />
      <path d="M 190 360 L 500 170" fill="none" stroke="#00E5FF" strokeWidth="24" strokeLinecap="round" opacity="0.38" />
      <path d="M 500 170 L 810 360" fill="none" stroke={accent} strokeWidth="24" strokeLinecap="round" opacity="0.30" />
      <circle cx="500" cy="170" r="44" fill="#04111f" stroke={solved ? '#00FF88' : accent} strokeWidth="7" />
      <text x="304" y="146" fill="#9FF5FF" fontSize="23" fontWeight="900">soldan eğim</text>
      <text x="658" y="146" fill="#FFB3D7" fontSize="23" fontWeight="900">sağdan eğim</text>
      <rect x="385" y="222" width="230" height="72" rx="24" fill="#020913" stroke={accent} strokeWidth="2" opacity="0.94" />
      <text x="500" y="252" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900">f'(2) yok</text>
      <text x="500" y="278" textAnchor="middle" fill="#A7F3D0" fontSize="15" fontWeight="800">tek teğet yönü oluşmadı</text>
      <text x="500" y="334" textAnchor="middle" fill={accent} fontSize="18" fontWeight="900">soldan eğim ≠ sağdan eğim</text>
      <text x="514" y="102" fill="#FFFFFF" fontSize="18" fontWeight="900">x=2</text>
    </g>
  );
}

function GapTrack({ accent, solved }: { accent: string; solved: boolean }) {
  return (
    <g>
      <path d="M 160 350 C 280 332 370 262 448 228" fill="none" stroke="#00E5FF" strokeWidth="18" strokeLinecap="round" filter="url(#alarm-glow-broken-track)" />
      <path d="M 552 292 C 650 250 740 220 850 176" fill="none" stroke={accent} strokeWidth="18" strokeLinecap="round" filter="url(#alarm-glow-broken-track)" />
      <rect x="455" y="178" width="90" height="166" rx="28" fill="#020913" stroke={solved ? '#00FF88' : accent} strokeDasharray="10 10" strokeWidth="4" />
      <circle cx="448" cy="228" r="16" fill="#020913" stroke="#00E5FF" strokeWidth="6" />
      <circle cx="552" cy="292" r="16" fill="#020913" stroke={accent} strokeWidth="6" />
      <text x="500" y="146" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900">grafik kopuk</text>
      <rect x="376" y="354" width="248" height="68" rx="24" fill="#020913" stroke={accent} strokeWidth="2" opacity="0.94" />
      <text x="500" y="383" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900">f'(2) yok</text>
      <text x="500" y="408" textAnchor="middle" fill="#A7F3D0" fontSize="15" fontWeight="800">önce süreklilik gerekir</text>
      <text x="514" y="176" fill="#FFFFFF" fontSize="18" fontWeight="900">x=2</text>
    </g>
  );
}

interface AlarmControlsProps {
  missionIndex: number;
  selectedTool: AlarmTool | null;
  solved: boolean;
  status: Grade12StageStatus;
  onToolChange: (tool: AlarmTool) => void;
  onCheck: () => void;
  onNext: () => void;
}

function AlarmControls({ missionIndex, selectedTool, solved, status, onToolChange, onCheck, onNext }: AlarmControlsProps) {
  const mission = alarmMissions[missionIndex];
  const hasNextMission = missionIndex < alarmMissions.length - 1;
  const checkClass = status === 'success'
    ? 'border-[#00FF88]/34 bg-[#00FF88]/18 text-emerald-100'
    : status === 'error'
      ? 'border-[#FF4FA3]/30 bg-[#FF4FA3]/14 text-pink-100'
      : 'border-white/12 bg-white/[0.07] text-white/82';

  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 overflow-hidden">
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
        <p className="mt-1 text-xs font-bold leading-snug text-white/68">{mission.prompt}</p>
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
              className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-left transition ${
                isActive
                  ? 'border-[#00E5FF]/58 bg-[#00E5FF]/16 text-cyan-50 shadow-[0_0_22px_rgba(0,229,255,0.12)]'
                  : 'border-white/12 bg-white/[0.07] text-white/74 hover:border-[#00E5FF]/28 hover:text-cyan-100'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">{item.label}</span>
                <span className="mt-1 block text-xs font-bold leading-snug text-white/58">{item.description}</span>
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

function AlarmCompletion({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      data-testid={`${MODULE_ID}-completion`}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative w-[min(92vw,980px)] overflow-hidden rounded-[30px] border border-[#00E5FF]/24 bg-[#04111f] p-6 text-white shadow-[0_0_96px_rgba(0,229,255,0.22),0_34px_80px_rgba(0,0,0,0.54)] ring-1 ring-white/8 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(251,191,36,0.22),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(255,79,163,0.20),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.10),transparent_44%)]" />
      <div className="relative grid gap-5">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-[#00E5FF]/44 bg-[#00E5FF]/16 shadow-[0_0_42px_rgba(0,229,255,0.28)]">
            <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-[#00FF88]" />
            <AlertTriangle className="h-8 w-8 text-cyan-100" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#9FF5FF]">derivative alarm mastery</p>
            <h2 className="mt-1 text-3xl font-black leading-tight text-white">Türev yok alarmı tamamlandı</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-snug text-white/82">
              Öğrenci sivri uç ile kopuk grafiği aynı kalabalık pistte değil, iki ayrı alarm davranışı olarak ayırdı.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProofCard title="Sivri Uç" symbol="V" note="Soldan ve sağdan eğim tek teğette birleşmedi." accent="#FBBF24" />
          <ProofCard title="Kopuk Grafik" symbol="!" note="Fonksiyon aynı noktada kesintisiz davranmadı." accent="#FF4FA3" />
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/14 bg-black/34 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold leading-snug text-white/82">
            Kesen-teğet modülü temiz kaldı; türev-yok durumları artık kendi alarm istasyonunda.
          </p>
          <div className="flex shrink-0 gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/16 bg-white/[0.08] px-4 text-sm font-black text-white/88 transition hover:border-[#00E5FF]/44 hover:text-cyan-100"
            >
              <RotateCcw className="h-4 w-4" />
              Tekrar Oyna
            </motion.button>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#00E5FF]/28 bg-[#00E5FF]/14 px-4 text-sm font-black text-cyan-100 transition hover:border-[#00E5FF]/54"
            >
              <Home className="h-4 w-4" />
              Ana Merkez
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProofCard({ title, symbol, note, accent }: { title: string; symbol: string; note: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/14 bg-white/[0.08] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/68">{title}</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-white/86">{note}</p>
        </div>
        <span
          className="grid h-[52px] w-[68px] shrink-0 place-items-center rounded-[20px] border bg-black/28 font-mono text-xl font-black text-white"
          style={{ borderColor: `${accent}66`, boxShadow: `0 0 26px ${accent}24` }}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}

function TestIdContractMarker() {
  return <span className="sr-only">{TEST_ID_CONTRACT.join(' ')}</span>;
}

function getScanPoint(mode: 'corner' | 'gap', progress: number) {
  if (mode === 'corner') {
    const x = 190 + progress * 620;
    const y = x <= 500 ? 360 - (x - 190) * 0.61 : 170 + (x - 500) * 0.61;
    return { x, y };
  }

  if (progress < 0.48) {
    const t = progress / 0.48;
    return {
      x: 160 + t * 288,
      y: 350 - t * 122,
    };
  }

  const t = (progress - 0.52) / 0.48;
  return {
    x: 552 + Math.max(0, Math.min(1, t)) * 298,
    y: 292 - Math.max(0, Math.min(1, t)) * 116,
  };
}

function scanLabel(mode: 'corner' | 'gap', progress: number) {
  if (mode === 'corner') {
    if (progress < 0.42) return 'soldan eğim';
    if (progress > 0.58) return 'sağdan eğim';
    return 'sivri nokta';
  }

  if (progress < 0.48) return 'sol parça';
  if (progress > 0.52) return 'sağ parça';
  return 'kopukluk';
}
