import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { buildMatches, evidenceLabel, isTargetTool } from './rightTriangleTheoremModel';
import type { TheoremBuild, TheoremMission, TheoremTool, TheoremToolId } from './types';

interface RightTriangleTheoremSceneProps {
  mission: TheoremMission;
  build: TheoremBuild;
  locked: boolean;
  onToggleTool: (toolId: TheoremToolId) => void;
  onAutoBuild: () => void;
}

const toolTestIds: Record<TheoremToolId, string> = {
  'tales-slice-2-5': 'right-triangle-theorem-lab-tool-tales-slice-2-5',
  'tales-slice-3-5': 'right-triangle-theorem-lab-tool-tales-slice-3-5',
  'tales-slice-4-5': 'right-triangle-theorem-lab-tool-tales-slice-4-5',
  'tales-part-whole': 'right-triangle-theorem-lab-tool-tales-part-whole',
  'tales-cross-product': 'right-triangle-theorem-lab-tool-tales-cross-product',
  'euclid-height-square': 'right-triangle-theorem-lab-tool-euclid-height-square',
  'euclid-segment-product': 'right-triangle-theorem-lab-tool-euclid-segment-product',
  'euclid-leg-square': 'right-triangle-theorem-lab-tool-euclid-leg-square',
  'euclid-sum-segments': 'right-triangle-theorem-lab-tool-euclid-sum-segments',
  'pythagoras-leg-a': 'right-triangle-theorem-lab-tool-pythagoras-leg-a',
  'pythagoras-leg-b': 'right-triangle-theorem-lab-tool-pythagoras-leg-b',
  'pythagoras-hypotenuse': 'right-triangle-theorem-lab-tool-pythagoras-hypotenuse',
  'pythagoras-sum-equation': 'right-triangle-theorem-lab-tool-pythagoras-sum-equation',
  'pythagoras-product-equation': 'right-triangle-theorem-lab-tool-pythagoras-product-equation',
};

export function RightTriangleTheoremScene({
  mission,
  build,
  locked,
  onToggleTool,
  onAutoBuild,
}: RightTriangleTheoremSceneProps) {
  const matched = buildMatches(build, mission);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Home') return;
    event.preventDefault();
    onAutoBuild();
  };

  return (
    <section
      data-testid="right-triangle-theorem-lab-scene"
      tabIndex={0}
      aria-keyshortcuts="Home"
      onKeyDown={handleKeyDown}
      className="relative min-h-[660px] overflow-hidden rounded-[2rem] border border-cyan-200/18 bg-[#04101a]/90 p-4 shadow-[0_34px_90px_rgba(0,0,0,0.52)] outline-none focus:ring-2 focus:ring-cyan-200/55 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-60 w-60 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
      </div>

      <div className="relative z-10 grid items-start gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-black/32 p-4 backdrop-blur">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">teorem hedefi</p>
          <h2 className="mt-2 text-xl font-black leading-tight text-white">{mission.title}</h2>
          <div className="mt-4 grid gap-3">
            <InfoCard label="atom" value={mission.atomId} />
            <InfoCard label="kanıt" value={evidenceLabel(build, mission)} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/38 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/65">kanıt sahası</p>
              <h3 className="mt-1 text-xl font-black text-white">Dik üçgeni çalıştır</h3>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-right ${locked ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100' : matched ? 'border-amber-300/35 bg-amber-300/10 text-amber-100' : 'border-cyan-300/22 bg-cyan-300/[0.07] text-cyan-100'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">durum</p>
              <p className="text-sm font-black">{locked ? 'mühürlü' : matched ? 'test hazır' : evidenceLabel(build, mission)}</p>
            </div>
          </div>

          <svg viewBox="0 0 760 430" className="h-[430px] w-full rounded-[1.75rem] border border-white/10 bg-[#010814]/85">
            <defs>
              <filter id="right-theorem-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {mission.mode === 'tales' ? <TalesDrawing build={build} locked={locked} /> : null}
            {mission.mode === 'euclid' ? <EuclidDrawing build={build} locked={locked} /> : null}
            {mission.mode === 'pythagoras' ? <PythagorasDrawing build={build} locked={locked} /> : null}
          </svg>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-3xl border border-white/10 bg-black/34 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">kanıt parçaları</p>
            <p className="mt-1 text-sm font-bold text-white/55">Parça seçtikçe sahne ışıklanır; sonuç testten önce kilitli kalır.</p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black text-white/58 sm:block">
            {mission.mode === 'tales' ? 'paralel oran' : mission.mode === 'euclid' ? 'yükseklik' : 'denklem'}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {mission.tools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              selected={build.selectedTools.includes(tool.id)}
              valid={isTargetTool(mission, tool.id)}
              locked={locked}
              onToggleTool={onToggleTool}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/32 p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">kanıt hattı</p>
          <div className="mt-3 flex min-h-[58px] flex-wrap gap-2">
            {build.selectedTools.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/14 px-4 py-3 text-sm font-bold text-white/42">Parça seçilince kanıt hattına düşer.</div>
            ) : (
              build.selectedTools.map((toolId) => {
                const tool = mission.tools.find((item) => item.id === toolId);
                const valid = isTargetTool(mission, toolId);
                return (
                  <div
                    key={`proof-${toolId}`}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black ${valid ? 'border-emerald-300/30 bg-emerald-300/[0.09] text-emerald-100' : 'border-rose-300/30 bg-rose-300/[0.09] text-rose-100'}`}
                  >
                    {tool?.label}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`rounded-3xl border p-4 ${locked ? 'border-emerald-300/32 bg-emerald-300/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">sonuç mührü</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold leading-relaxed text-white/62">
              {locked ? 'Teorem test edildi; kanıt artık okunabilir.' : 'Teorem sonucu testten önce kilitli kalır.'}
            </p>
            <div className={`min-w-[170px] rounded-2xl border px-4 py-3 text-center ${locked ? 'border-emerald-300/38 bg-black/24 text-emerald-100' : 'border-white/12 bg-black/22 text-white/36'}`}>
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-70">{locked ? 'kanıt' : 'kilitli'}</p>
              <p className="mt-1 text-sm font-black">{locked ? mission.resultLabel : '???'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TalesDrawing({ build, locked }: { build: TheoremBuild; locked: boolean }) {
  const slice = build.selectedTools.includes('tales-slice-2-5') ? 0.4 : build.selectedTools.includes('tales-slice-4-5') ? 0.8 : build.selectedTools.includes('tales-slice-3-5') ? 0.6 : 0.5;
  const left = { x: 130 + 150 * slice, y: 345 - 210 * slice };
  const right = { x: 130 + 410 * slice, y: 345 - 210 * slice };
  const correct = build.selectedTools.includes('tales-slice-3-5') && build.selectedTools.includes('tales-part-whole');
  return (
    <g>
      <polygon points="130,345 540,345 280,135" fill="rgba(0,229,255,0.10)" stroke="#22D3EE" strokeWidth="5" strokeLinejoin="round" filter="url(#right-theorem-glow)" />
      <motion.line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={correct || locked ? '#00FF88' : '#FBBF24'} strokeWidth="8" strokeLinecap="round" filter="url(#right-theorem-glow)" animate={{ opacity: [0.72, 1, 0.72] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <line x1="130" y1="345" x2={left.x} y2={left.y} stroke="#00FF88" strokeWidth="5" strokeLinecap="round" />
      <line x1={left.x} y1={left.y} x2="280" y2="135" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round" />
      <line x1="130" y1="345" x2={right.x} y2={right.y} stroke="#00FF88" strokeWidth="5" strokeLinecap="round" />
      <line x1={right.x} y1={right.y} x2="540" y2="345" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round" />
      <Label x={126} y={374} text="A" />
      <Label x={548} y={374} text="B" />
      <Label x={278} y={118} text="C" />
      <Label x={left.x - 18} y={left.y - 10} text="D" />
      <Label x={right.x + 20} y={right.y - 10} text="E" />
      <text x="352" y="395" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">paralel kesit</text>
      <text x="352" y="72" textAnchor="middle" fill="#67E8F9" fontSize="20" fontWeight="900">AD/AC ve AE/AB aynı anda değişir</text>
      <MiniSeal x={585} y={160} title="oran" value={correct || locked ? '3/5' : `${Math.round(slice * 5)}/5`} tone={correct || locked ? '#00FF88' : '#FBBF24'} />
    </g>
  );
}

function EuclidDrawing({ build, locked }: { build: TheoremBuild; locked: boolean }) {
  const hasHeight = build.selectedTools.includes('euclid-height-square');
  const hasProduct = build.selectedTools.includes('euclid-segment-product');
  const correct = hasHeight && hasProduct;
  return (
    <g>
      <polygon points="140,330 620,330 420,105" fill="rgba(45,212,191,0.11)" stroke="#2DD4BF" strokeWidth="5" strokeLinejoin="round" filter="url(#right-theorem-glow)" />
      <line x1="420" y1="105" x2="330" y2="330" stroke={hasHeight ? '#00FF88' : 'rgba(255,255,255,0.25)'} strokeWidth="7" strokeLinecap="round" strokeDasharray="10 8" />
      <rect x="386" y="214" width="68" height="68" rx="14" fill={hasHeight ? 'rgba(0,255,136,0.18)' : 'rgba(255,255,255,0.05)'} stroke={hasHeight ? '#00FF88' : 'rgba(255,255,255,0.18)'} strokeWidth="4" />
      <motion.rect x="176" y="340" width="128" height="34" rx="14" fill={hasProduct ? 'rgba(251,191,36,0.20)' : 'rgba(255,255,255,0.06)'} stroke={hasProduct ? '#FBBF24' : 'rgba(255,255,255,0.18)'} strokeWidth="4" animate={{ opacity: hasProduct ? [0.72, 1, 0.72] : 0.5 }} transition={{ duration: 1.3, repeat: Infinity }} />
      <motion.rect x="345" y="340" width="220" height="34" rx="14" fill={hasProduct ? 'rgba(251,191,36,0.20)' : 'rgba(255,255,255,0.06)'} stroke={hasProduct ? '#FBBF24' : 'rgba(255,255,255,0.18)'} strokeWidth="4" animate={{ opacity: hasProduct ? [0.72, 1, 0.72] : 0.5 }} transition={{ duration: 1.3, repeat: Infinity }} />
      <Label x={136} y={360} text="A" />
      <Label x={626} y={360} text="B" />
      <Label x={420} y={88} text="C" />
      <Label x={330} y={360} text="H" />
      <text x="238" y="364" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="900">p</text>
      <text x="454" y="364" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="900">k</text>
      <text x="456" y="242" fill="#00FF88" fontSize="18" fontWeight="900">h</text>
      <text x="380" y="72" textAnchor="middle" fill="#67E8F9" fontSize="20" fontWeight="900">dik açıdan hipotenüse yükseklik</text>
      <MiniSeal x={585} y={150} title="Öklid" value={correct || locked ? 'h²=p·k' : '???'} tone={correct || locked ? '#00FF88' : '#94A3B8'} />
    </g>
  );
}

function PythagorasDrawing({ build, locked }: { build: TheoremBuild; locked: boolean }) {
  const hasA = build.selectedTools.includes('pythagoras-leg-a');
  const hasB = build.selectedTools.includes('pythagoras-leg-b');
  const hasHyp = build.selectedTools.includes('pythagoras-hypotenuse');
  const hasSum = build.selectedTools.includes('pythagoras-sum-equation');
  const correct = hasA && hasB && hasHyp && hasSum;
  return (
    <g>
      <polygon points="170,335 510,335 170,125" fill="rgba(179,136,255,0.11)" stroke="#B388FF" strokeWidth="5" strokeLinejoin="round" filter="url(#right-theorem-glow)" />
      <rect x="176" y="262" width="72" height="72" rx="14" fill={hasA ? 'rgba(0,229,255,0.16)' : 'rgba(255,255,255,0.04)'} stroke={hasA ? '#00E5FF' : 'rgba(255,255,255,0.16)'} strokeWidth="4" />
      <rect x="294" y="270" width="94" height="58" rx="14" fill={hasB ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)'} stroke={hasB ? '#00FF88' : 'rgba(255,255,255,0.16)'} strokeWidth="4" />
      <rect x="420" y="202" width="108" height="70" rx="16" fill={hasHyp ? 'rgba(251,191,36,0.16)' : 'rgba(255,255,255,0.04)'} stroke={hasHyp ? '#FBBF24' : 'rgba(255,255,255,0.16)'} strokeWidth="4" transform="rotate(-32 474 237)" />
      <text x="150" y="235" textAnchor="middle" fill="#00E5FF" fontSize="21" fontWeight="900">x</text>
      <text x="340" y="365" textAnchor="middle" fill="#00FF88" fontSize="21" fontWeight="900">x + 2</text>
      <text x="376" y="205" textAnchor="middle" fill="#FBBF24" fontSize="21" fontWeight="900">10</text>
      <path d="M170 310 L195 310 L195 335" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.7" />
      <Label x={168} y={364} text="A" />
      <Label x={518} y={364} text="B" />
      <Label x={168} y={108} text="C" />
      <motion.path d="M245 160 C330 110 470 120 560 186" fill="none" stroke={hasSum ? '#00FF88' : 'rgba(255,255,255,0.20)'} strokeWidth="8" strokeLinecap="round" strokeDasharray="16 12" animate={{ strokeDashoffset: hasSum ? [0, -56] : 0 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
      <text x="380" y="72" textAnchor="middle" fill="#C4B5FD" fontSize="20" fontWeight="900">dik kenar kareleri hipotenüse bağlanır</text>
      <MiniSeal x={570} y={150} title="denklem" value={correct || locked ? 'x²+(x+2)²=10²' : '???'} tone={correct || locked ? '#00FF88' : '#94A3B8'} />
    </g>
  );
}

function ToolButton({
  tool,
  selected,
  valid,
  locked,
  onToggleTool,
}: {
  tool: TheoremTool;
  selected: boolean;
  valid: boolean;
  locked: boolean;
  onToggleTool: (toolId: TheoremToolId) => void;
}) {
  return (
    <motion.button
      type="button"
      data-testid={toolTestIds[tool.id]}
      disabled={locked}
      whileHover={locked ? undefined : { y: -2 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      onClick={() => onToggleTool(tool.id)}
      className={`min-h-[88px] rounded-2xl border p-3 text-left transition ${
        selected
          ? valid
            ? 'border-emerald-300/38 bg-emerald-300/[0.10] text-emerald-100 shadow-[0_0_22px_rgba(0,255,136,0.12)]'
            : 'border-rose-300/35 bg-rose-300/[0.10] text-rose-100'
          : 'border-cyan-300/18 bg-cyan-300/[0.055] text-cyan-50 hover:border-cyan-200/36'
      }`}
    >
      <span className="block text-sm font-black">{tool.label}</span>
      <span className="mt-1 block text-xs font-bold leading-snug text-white/55">{tool.detail}</span>
    </motion.button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r="19" fill="#020617" stroke="#67E8F9" strokeWidth="4" />
      <text x={x} y={y} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">{text}</text>
    </g>
  );
}

function MiniSeal({ x, y, title, value, tone }: { x: number; y: number; title: string; value: string; tone: string }) {
  return (
    <g>
      <rect x={x - 88} y={y - 34} width="176" height="80" rx="22" fill="rgba(2,6,23,0.88)" stroke={tone} strokeWidth="3" />
      <text x={x} y={y - 8} textAnchor="middle" fill={tone} fontSize="12" fontWeight="900" letterSpacing="2">{title}</text>
      <text x={x} y={y + 22} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">{value}</text>
    </g>
  );
}
