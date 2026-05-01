import { motion } from 'motion/react';
import { CircuitInputs, GateMissionTarget } from './types';
import { gateName, gateSymbol } from './circuitModel';

interface CircuitSceneProps {
  inputs: CircuitInputs;
  target: GateMissionTarget;
  output: boolean;
  missionOk: boolean;
}

export function CircuitScene({ inputs, target, output, missionOk }: CircuitSceneProps) {
  const failure = target.gate === 'implies' && inputs.a && !inputs.b;
  const offColor = '#64748B';
  const inputAColor = inputs.a ? '#00FF88' : offColor;
  const inputBColor = inputs.b ? '#00FF88' : offColor;
  const outputColor = output ? '#00FF88' : failure ? '#FF0055' : offColor;

  return (
    <section data-testid="logic-scene" className="relative overflow-hidden rounded-[26px] border border-sky-300/18 bg-black/35 p-5 shadow-[0_0_55px_rgba(56,189,248,0.10)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative mb-4 grid gap-3 md:flex md:flex-wrap md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">makro atom: MAT.9.3.2.x</p>
          <h2 className="text-2xl font-black text-white">Kapıyı Test Et, Kuralı Gör</h2>
        </div>
        <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${missionOk ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : 'border-sky-300/25 bg-sky-300/10 text-sky-100'}`}>
          {missionOk ? 'Kural kilitlendi' : `A=${Number(inputs.a)} · B=${Number(inputs.b)} · Y=${Number(output)}`}
        </div>
      </div>

      <svg viewBox="0 0 720 500" className="relative h-[500px] w-full rounded-[24px] border border-white/10 bg-[#020611]/78 sm:h-[520px]">
        <defs>
          <filter id="logic-v4-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x="52" y="54" width="616" height="392" rx="32" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" />

        <WireNode x={132} y={158} label="A" value={inputs.a} color={inputAColor} />
        <WireNode x={132} y={342} label="B" value={inputs.b} color={inputBColor} />
        <SignalCable active={inputs.a} x1={178} y1={158} x2={316} y2={228} color={inputAColor} />
        <SignalCable active={inputs.b} x1={178} y1={342} x2={316} y2={272} color={inputBColor} />

        <motion.rect
          x="316"
          y="184"
          width="168"
          height="132"
          rx="28"
          fill={failure ? 'rgba(255,0,85,0.18)' : 'rgba(56,189,248,0.11)'}
          stroke={failure ? '#FF0055' : '#38BDF8'}
          strokeWidth="5"
          filter={failure || missionOk ? 'url(#logic-v4-glow)' : undefined}
          animate={failure ? { x: [316, 310, 322, 316] } : { opacity: [0.82, 1, 0.82] }}
          transition={{ duration: failure ? 0.28 : 1.6, repeat: Infinity }}
        />
        <text x="400" y="244" textAnchor="middle" fill="#FFFFFF" fontSize="17" fontWeight="900">{gateName(target.gate)}</text>
        <text x="400" y="282" textAnchor="middle" fill="#FFFFFF" fontSize="42" fontWeight="900">{gateSymbol(target.gate)}</text>

        <SignalCable active={output} x1={484} y1={250} x2={520} y2={250} color={outputColor} />
        <circle cx="560" cy="250" r="42" fill={`${outputColor}24`} stroke={outputColor} strokeWidth="5" />
        <text x="560" y="237" textAnchor="middle" fill="rgba(255,255,255,0.74)" fontSize="15" fontWeight="900">Y</text>
        <text x="560" y="268" textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="900">{Number(output)}</text>

        {failure ? (
          <>
            <motion.circle cx="400" cy="250" r="74" fill="none" stroke="#FF0055" strokeWidth="5" animate={{ r: [56, 96, 56], opacity: [0.9, 0.18, 0.9] }} transition={{ duration: 1, repeat: Infinity }} />
            <text x="400" y="366" textAnchor="middle" fill="#FF6B9A" fontSize="20" fontWeight="900">1 =&gt; 0 tek çöküş durumudur</text>
          </>
        ) : null}

        <CurrentTruthRow inputs={inputs} output={output} failure={failure} />
        <text x="360" y="428" textAnchor="middle" fill="#A5F3FC" fontSize="18" fontWeight="900">{target.rule}</text>
      </svg>
    </section>
  );
}

function WireNode({ x, y, label, value, color }: { x: number; y: number; label: string; value: boolean; color: string }) {
  return (
    <g>
      <rect x={x - 48} y={y - 38} width="96" height="76" rx="18" fill={`${color}22`} stroke={color} strokeWidth="5" filter={value ? 'url(#logic-v4-glow)' : undefined} />
      <text x={x} y={y - 5} textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">{label}</text>
      <text x={x} y={y + 24} textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">{Number(value)}</text>
    </g>
  );
}

function SignalCable({ active, x1, y1, x2, y2, color }: { active: boolean; x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.13)" strokeWidth="12" strokeLinecap="round" />
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? color : 'rgba(148,163,184,0.36)'}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={active ? '18 12' : undefined}
        animate={active ? { strokeDashoffset: [0, -60] } : undefined}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </g>
  );
}

function CurrentTruthRow({ inputs, output, failure }: { inputs: CircuitInputs; output: boolean; failure: boolean }) {
  return (
    <g>
      <rect x="226" y="98" width="268" height="62" rx="18" fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.30)" strokeWidth="3" />
      <text x="360" y="122" textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12" fontWeight="900">aktif doğruluk satırı</text>
      <text x="360" y="148" textAnchor="middle" fill={failure ? '#FF6B9A' : output ? '#00FF88' : '#CBD5E1'} fontSize="20" fontWeight="900">
        A={Number(inputs.a)} · B={Number(inputs.b)} =&gt; Y={Number(output)}
      </text>
    </g>
  );
}
