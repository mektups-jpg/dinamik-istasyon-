import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { RadicalNumber } from './RealNumberLawMath';
import { AtlasMission, BuildKey, LawBuild } from './types';

interface RealNumberLawSceneProps {
  mission: AtlasMission;
  build: LawBuild;
  matched: boolean;
  locked: boolean;
  onToggle: (key: BuildKey) => void;
  onAutoAlign: () => void;
}

export function RealNumberLawScene({ mission, build, matched, locked, onToggle, onAutoAlign }: RealNumberLawSceneProps) {
  return (
    <section
      data-testid="real-number-law-atlas-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={(event) => {
        if (event.key === 'Home') onAutoAlign();
      }}
      className="relative min-h-[560px] min-w-0 overflow-hidden rounded-[34px] border border-cyan-200/18 bg-[#03101a]/88 p-4 pt-12 shadow-[0_32px_100px_rgba(0,0,0,0.44)] outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-200/70 lg:min-h-[620px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none absolute inset-x-10 top-6 h-28 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-56 w-4/5 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/52">aktif atlas görevi</p>
          <h2 className="mt-1 max-w-[520px] text-2xl font-black tracking-tight text-white md:text-3xl">{mission.title}</h2>
          <p className="mt-2 max-w-[620px] text-sm font-semibold leading-relaxed text-cyan-50/66">{mission.sceneLabel}</p>
        </div>
        <div className={`rounded-2xl border px-4 py-3 text-right shadow-[0_0_32px_rgba(0,229,255,0.08)] ${matched ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100' : 'border-cyan-200/18 bg-black/28 text-cyan-100'}`}>
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] opacity-70">canlı okuma</p>
          <p className="mt-1 text-lg font-black">{locked ? mission.targetText : previewText(mission, build)}</p>
        </div>
      </div>

      <div className="relative z-10 mt-6 min-h-[430px] rounded-[30px] border border-white/10 bg-black/42 p-4 shadow-inner shadow-black/40">
        {mission.kind === 'natural-integer' ? (
          <NaturalIntegerMachine mission={mission} build={build} matched={matched} locked={locked} onToggle={onToggle} />
        ) : null}
        {mission.kind === 'real-umbrella' ? (
          <RealUmbrellaMachine mission={mission} build={build} matched={matched} locked={locked} onToggle={onToggle} />
        ) : null}
        {mission.kind === 'associative' ? (
          <AssociativeMachine mission={mission} build={build} matched={matched} locked={locked} onToggle={onToggle} />
        ) : null}
        {mission.kind === 'distributive' ? (
          <DistributiveMachine mission={mission} build={build} matched={matched} locked={locked} onToggle={onToggle} />
        ) : null}
      </div>
    </section>
  );
}

function NaturalIntegerMachine({ mission, build, matched, locked, onToggle }: MachineProps) {
  const integerValue = mission.examples?.integerValue ?? '−3';

  return (
    <div className="grid h-full min-h-[398px] place-items-center gap-5 lg:grid-cols-[1fr_1.1fr_1fr]">
      <NumberCapsule label={integerValue} caption="negatif kapsül" tone="pink" />
      <div className="relative flex h-[300px] w-full max-w-[360px] items-center justify-center">
        <NestedRing label="R gerçek sayılar" className="h-[300px] w-[300px] border-cyan-300/28 bg-cyan-300/[0.055]" />
        <NestedRing label="Z tam sayılar" active={build.integerGate} className="h-[214px] w-[214px] border-emerald-300/34 bg-emerald-300/[0.07]" />
        <NestedRing label="N doğal sayılar" active={build.naturalGate} className="h-[128px] w-[128px] border-amber-200/34 bg-amber-200/[0.07]" />
        <motion.div
          animate={{ x: build.integerGate ? 0 : -92, y: build.naturalGate ? 0 : 66, scale: build.integerGate ? 1.08 : 1 }}
          className={`absolute grid h-20 w-20 place-items-center rounded-3xl border text-4xl font-black ${build.naturalGate ? 'border-pink-300/70 bg-pink-500/22 text-pink-50' : build.integerGate ? 'border-emerald-200/70 bg-emerald-300/18 text-white' : 'border-white/16 bg-white/8 text-white'}`}
        >
          {integerValue}
        </motion.div>
      </div>
      <div className="grid w-full max-w-[280px] gap-3">
        <SceneSwitch testId="real-number-law-atlas-natural" active={build.naturalGate} label="N kapısı" detail="Doğal sayılar" tone="amber" onClick={() => onToggle('naturalGate')} />
        <SceneSwitch testId="real-number-law-atlas-integer" active={build.integerGate} label="Z kapısı" detail="Tam sayılar" tone="green" onClick={() => onToggle('integerGate')} />
        <ResultSeal locked={locked} matched={matched} label={`${integerValue} tam sayı katmanında; doğal sayılarda değil.`} />
      </div>
    </div>
  );
}

function RealUmbrellaMachine({ mission, build, matched, locked, onToggle }: MachineProps) {
  const rationalValue = mission.examples?.rationalValue ?? '3/4';
  const radicalValue = mission.examples?.radicalValue ?? 2;

  return (
    <div className="grid h-full min-h-[398px] gap-5 lg:grid-cols-[1fr_1.2fr_1fr]">
      <div className="grid content-center gap-4">
        <NumberCapsule label={rationalValue} caption="rasyonel iz" tone="cyan" />
        <NumberCapsule label={<RadicalNumber value={radicalValue} size="display" />} caption="irrasyonel iz" tone="purple" />
      </div>
      <div className="relative flex min-h-[330px] items-center justify-center">
        <motion.div
          animate={{ scale: build.realUmbrella ? 1.04 : 1 }}
          className={`absolute h-[280px] w-[360px] rounded-[46%_46%_38%_38%] border ${build.realUmbrella ? 'border-emerald-200/55 bg-emerald-300/10 shadow-[0_0_70px_rgba(52,211,153,0.20)]' : 'border-cyan-200/22 bg-cyan-300/[0.045]'}`}
        />
        <Beam active={build.rationalGate} className="left-[8%] top-[44%] w-[38%] rotate-[16deg] bg-cyan-300" />
        <Beam active={build.irrationalGate} className="right-[8%] top-[44%] w-[38%] -rotate-[16deg] bg-violet-300" />
        <div className="relative z-10 grid h-32 w-40 place-items-center rounded-[30px] border border-white/14 bg-black/55 text-center shadow-[0_18px_50px_rgba(0,0,0,0.34)]">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/60">şemsiye</p>
          <p className="text-5xl font-black text-white">R</p>
          <p className="text-xs font-bold text-white/58">gerçek sayılar</p>
        </div>
      </div>
      <div className="grid content-center gap-3">
        <SceneSwitch testId="real-number-law-atlas-rational" active={build.rationalGate} label="Q ışını" detail={`${rationalValue} rasyonel`} tone="cyan" onClick={() => onToggle('rationalGate')} />
        <SceneSwitch testId="real-number-law-atlas-irrational" active={build.irrationalGate} label="I ışını" detail={<><RadicalNumber value={radicalValue} /> irrasyonel</>} tone="purple" onClick={() => onToggle('irrationalGate')} />
        <SceneSwitch testId="real-number-law-atlas-real" active={build.realUmbrella} label="R şemsiyesi" detail="ikisini kapsar" tone="green" onClick={() => onToggle('realUmbrella')} />
        <ResultSeal locked={locked} matched={matched} label="Rasyonel ve irrasyonel sayılar birlikte gerçek sayıları oluşturur." />
      </div>
    </div>
  );
}

function AssociativeMachine({ build, matched, locked, onToggle }: MachineProps) {
  return (
    <div className="grid h-full min-h-[398px] gap-5 lg:grid-cols-[1fr_1.25fr_1fr]">
      <ExpressionStack items={['a', 'b', 'c']} />
      <div className="relative flex min-h-[340px] items-center justify-center">
        <Beam active={build.leftGroup} className="left-[12%] top-[33%] w-[42%] rotate-[-22deg] bg-cyan-300" />
        <Beam active={build.rightGroup} className="right-[12%] top-[60%] w-[42%] rotate-[-22deg] bg-emerald-300" />
        <GroupPod active={build.leftGroup} className="left-5 top-14" label="(a+b)+c" />
        <GroupPod active={build.rightGroup} className="right-5 bottom-14" label="a+(b+c)" />
        <div className={`relative z-10 grid h-36 w-44 place-items-center rounded-[32px] border text-center ${matched ? 'border-emerald-200/55 bg-emerald-300/14 shadow-[0_0_64px_rgba(52,211,153,0.18)]' : 'border-white/12 bg-black/52'}`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/58">toplam çekirdeği</p>
          <p className="text-3xl font-black text-white">a+b+c</p>
          <p className="text-xs font-bold text-white/58">{locked ? 'iki yol aynı' : 'iki grup yolunu yak'}</p>
        </div>
      </div>
      <div className="grid content-center gap-3">
        <SceneSwitch testId="real-number-law-atlas-left-group" active={build.leftGroup} label="Önce a+b" detail="sol grup yolu" tone="cyan" onClick={() => onToggle('leftGroup')} />
        <SceneSwitch testId="real-number-law-atlas-right-group" active={build.rightGroup} label="Önce b+c" detail="sağ grup yolu" tone="green" onClick={() => onToggle('rightGroup')} />
        <ResultSeal locked={locked} matched={matched} label="Toplamda parantezin yeri değişse de sonuç aynı kalır." />
      </div>
    </div>
  );
}

function DistributiveMachine({ mission, build, matched, locked, onToggle }: MachineProps) {
  const resultVisible = matched || locked;
  const factor = mission.examples?.factor ?? 3;
  const constant = mission.examples?.constant ?? 2;
  const product = mission.examples?.product ?? factor * constant;
  const distributiveExpression = mission.examples?.distributiveExpression ?? `${factor}(x + ${constant})`;
  const distributiveResult = mission.examples?.distributiveResult ?? `${factor}x + ${product}`;

  return (
    <div className="grid h-full min-h-[398px] gap-5 lg:grid-cols-[1fr_1.25fr_1fr]">
      <div className="grid content-center gap-4">
        <NumberCapsule label={String(factor)} caption="çarpan" tone="green" />
        <NumberCapsule label={`(x + ${constant})`} caption="parantez" tone="amber" />
      </div>
      <div className="relative flex min-h-[340px] items-center justify-center">
        <Beam active={build.xArm} className="left-[19%] top-[35%] w-[42%] rotate-[-18deg] bg-emerald-300" />
        <Beam active={build.constantArm} className="left-[19%] top-[63%] w-[42%] rotate-[18deg] bg-amber-300" />
        <GroupPod active={build.xArm} className="right-8 top-14" label={resultVisible ? `${factor}x` : 'x kolu'} />
        <GroupPod active={build.constantArm} className="right-8 bottom-14" label={resultVisible ? String(product) : `${constant} kolu`} />
        <div className={`relative z-10 grid min-h-32 w-72 place-items-center rounded-[32px] border px-5 py-5 text-center ${matched ? 'border-emerald-200/55 bg-emerald-300/14 shadow-[0_0_64px_rgba(52,211,153,0.18)]' : 'border-white/12 bg-black/52'}`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/58">dağıtım presi</p>
          <motion.div
            animate={{ opacity: resultVisible ? 1 : 0.62, scale: resultVisible ? 1.04 : 1 }}
            className={`mt-1 w-full px-1 py-1 ${resultVisible ? 'text-emerald-50' : 'text-white/58'}`}
          >
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{resultVisible ? 'açılmış biçim' : 'sonucu kur'}</p>
            <p className="mt-1 whitespace-nowrap text-[clamp(1.45rem,2vw,1.8rem)] font-black tracking-normal">
              {resultVisible ? `${distributiveExpression} = ${distributiveResult}` : `${distributiveExpression} = ?`}
            </p>
          </motion.div>
          <p className="text-xs font-bold text-white/58">{resultVisible ? 'iki kol toplandı' : 'iki kola gönder'}</p>
        </div>
      </div>
      <div className="grid content-center gap-3">
        <SceneSwitch testId="real-number-law-atlas-x-arm" active={build.xArm} label="x kolu" detail={`${factor} · x`} tone="green" onClick={() => onToggle('xArm')} />
        <SceneSwitch testId="real-number-law-atlas-constant-arm" active={build.constantArm} label={`${constant} kolu`} detail={`${factor} · ${constant}`} tone="amber" onClick={() => onToggle('constantArm')} />
        <ResultSeal locked={locked} matched={matched} label={`Dağılma sonucu: ${distributiveExpression} = ${distributiveResult}.`} readyLabel={`Hazır: ${distributiveExpression} = ${distributiveResult}.`} />
      </div>
    </div>
  );
}

interface MachineProps {
  mission: AtlasMission;
  build: LawBuild;
  matched: boolean;
  locked: boolean;
  onToggle: (key: BuildKey) => void;
}

function NumberCapsule({ label, caption, tone }: { label: ReactNode; caption: string; tone: 'cyan' | 'purple' | 'pink' | 'green' | 'amber' }) {
  const colors = {
    cyan: 'border-cyan-200/36 bg-cyan-300/10 text-cyan-50',
    purple: 'border-violet-200/36 bg-violet-300/10 text-violet-50',
    pink: 'border-pink-200/36 bg-pink-300/10 text-pink-50',
    green: 'border-emerald-200/36 bg-emerald-300/10 text-emerald-50',
    amber: 'border-amber-200/36 bg-amber-300/10 text-amber-50',
  };
  return (
    <div className={`mx-auto grid min-h-[104px] w-full max-w-[190px] place-items-center rounded-[30px] border p-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] ${colors[tone]}`}>
      <div className="grid min-h-[54px] place-items-center text-4xl font-black leading-none">{label}</div>
      <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] opacity-62">{caption}</p>
    </div>
  );
}

function NestedRing({ label, active, className }: { label: string; active?: boolean; className: string }) {
  return (
    <div className={`absolute grid place-items-center rounded-full border ${className} ${active ? 'shadow-[0_0_64px_rgba(52,211,153,0.20)]' : ''}`}>
      <span className="translate-y-[-42%] rounded-full border border-white/12 bg-black/45 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/70">{label}</span>
    </div>
  );
}

function SceneSwitch({ testId, active, label, detail, tone, onClick }: { testId: string; active: boolean; label: string; detail: ReactNode; tone: 'cyan' | 'purple' | 'pink' | 'green' | 'amber'; onClick: () => void }) {
  const activeClass = {
    cyan: 'border-cyan-200/55 bg-cyan-300/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.16)]',
    purple: 'border-violet-200/55 bg-violet-300/16 text-violet-50 shadow-[0_0_30px_rgba(167,139,250,0.16)]',
    pink: 'border-pink-200/55 bg-pink-300/16 text-pink-50 shadow-[0_0_30px_rgba(244,114,182,0.16)]',
    green: 'border-emerald-200/55 bg-emerald-300/16 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.16)]',
    amber: 'border-amber-200/55 bg-amber-300/16 text-amber-50 shadow-[0_0_30px_rgba(251,191,36,0.14)]',
  };
  return (
    <motion.button
      data-testid={testId}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`min-h-[68px] rounded-2xl border p-3 text-left transition ${active ? activeClass[tone] : 'border-white/12 bg-white/[0.055] text-white/74 hover:border-white/22 hover:bg-white/[0.085]'}`}
    >
      <span className="block text-sm font-black">{label}</span>
      <span className="mt-1 block text-xs font-semibold opacity-62">{detail}</span>
    </motion.button>
  );
}

function ResultSeal({ locked, matched, label, readyLabel = 'Kurulum hazır; şimdi kontrol et.' }: { locked: boolean; matched: boolean; label: string; readyLabel?: string }) {
  return (
    <div className={`rounded-2xl border p-3 text-sm font-bold leading-snug ${locked ? 'border-emerald-200/45 bg-emerald-300/12 text-emerald-50' : matched ? 'border-cyan-200/26 bg-cyan-300/9 text-cyan-50/82' : 'border-white/10 bg-black/24 text-white/54'}`}>
      {locked ? label : matched ? readyLabel : 'Sahnede doğru kapıları yak.'}
    </div>
  );
}

function Beam({ active, className }: { active: boolean; className: string }) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.18, scaleX: active ? 1 : 0.7 }}
      className={`absolute h-3 origin-left rounded-full blur-[0.2px] ${className} ${active ? 'shadow-[0_0_28px_currentColor]' : ''}`}
    />
  );
}

function GroupPod({ active, className, label }: { active: boolean; className: string; label: string }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.04 : 0.96, opacity: active ? 1 : 0.52 }}
      className={`absolute z-10 rounded-2xl border px-4 py-3 text-center text-lg font-black ${className} ${active ? 'border-emerald-200/45 bg-emerald-300/12 text-white' : 'border-white/12 bg-white/[0.055] text-white/58'}`}
    >
      {label}
    </motion.div>
  );
}

function ExpressionStack({ items }: { items: string[] }) {
  return (
    <div className="grid content-center gap-4">
      {items.map((item) => (
        <NumberCapsule key={item} label={item} caption="toplam parçası" tone="cyan" />
      ))}
    </div>
  );
}

function previewText(mission: AtlasMission, build: LawBuild) {
  if (mission.kind === 'natural-integer') {
    if (build.naturalGate && build.integerGate) return 'iki kapı da açık';
    if (build.integerGate) return 'Z kapısı açık';
    if (build.naturalGate) return 'N kapısı açık';
    return 'kapılar bekliyor';
  }
  if (mission.kind === 'real-umbrella') {
    const count = Number(build.rationalGate) + Number(build.irrationalGate) + Number(build.realUmbrella);
    return `${count}/3 ışın`;
  }
  if (mission.kind === 'associative') {
    const count = Number(build.leftGroup) + Number(build.rightGroup);
    return `${count}/2 grup yolu`;
  }
  if (build.xArm && build.constantArm) return mission.examples?.distributiveResult ?? '3x + 6';
  const count = Number(build.xArm) + Number(build.constantArm);
  return `${count}/2 dağıtım kolu`;
}
