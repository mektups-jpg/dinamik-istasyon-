import { motion } from 'motion/react';

type EdgeFeedback = 'idle' | 'success' | 'error';

export function EdgeLengthModel({ accent, feedback }: { accent: string; feedback: EdgeFeedback }) {
  const markColor = feedback === 'success' ? '#34D399' : accent;
  const faces = [
    { id: 'top', x: 110, y: 24 },
    { id: 'left', x: 38, y: 96 },
    { id: 'center', x: 110, y: 96 },
    { id: 'right', x: 182, y: 96 },
    { id: 'bottom', x: 110, y: 168 },
  ];

  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-white/10 bg-black/24 p-6">
      <div className="relative h-[260px] w-[300px]">
        {faces.map((face) => (
          <motion.div
            key={face.id}
            initial={{ opacity: 0.6, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute rounded-2xl border border-[#2EE7FF]/28 bg-[#0B2232]/90 shadow-[inset_0_0_24px_rgba(46,231,255,0.10)]"
            style={{ left: face.x, top: face.y, width: 68, height: 68 }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="absolute h-2 rounded-full"
          style={{ left: 110, top: 20, width: 68, backgroundColor: markColor, boxShadow: `0 0 24px ${markColor}` }}
          animate={{ scaleX: feedback === 'success' ? [1, 1.14, 1] : 1 }}
          transition={{ duration: 0.8, repeat: feedback === 'success' ? Infinity : 0 }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute h-2 rounded-full"
          style={{ left: 110, top: 236, width: 68, backgroundColor: markColor, boxShadow: `0 0 24px ${markColor}` }}
          animate={{ scaleX: feedback === 'success' ? [1, 1.14, 1] : 1 }}
          transition={{ duration: 0.8, repeat: feedback === 'success' ? Infinity : 0, delay: 0.08 }}
        />
        <span className="absolute grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/70 text-sm font-black text-white" style={{ left: 70, top: 5 }}>
          A
        </span>
        <span className="absolute grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/70 text-sm font-black text-white" style={{ left: 70, top: 221 }}>
          B
        </span>
      </div>
    </div>
  );
}
