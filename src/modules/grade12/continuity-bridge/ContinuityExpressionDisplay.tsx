interface ContinuityExpressionDisplayProps {
  expression: string;
  className?: string;
  targetClassName?: string;
}

export function ContinuityExpressionDisplay({
  expression,
  className = 'mt-1 flex flex-wrap items-start justify-center gap-x-1 gap-y-1 text-lg font-black tracking-tight text-white lg:text-xl',
  targetClassName = 'mt-1 whitespace-nowrap rounded-full border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-1.5 py-0.5 font-mono text-[10px] font-black leading-none text-[#9AF5FF] shadow-[0_0_14px_rgba(0,229,255,0.12)] lg:text-xs',
}: ContinuityExpressionDisplayProps) {
  const parts = expression.split(/(lim\s+x→\S+)/g).filter(Boolean);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        const match = part.match(/^lim\s+x→(\S+)$/);

        if (match === null) {
          return (
            <span key={`${part}-${index}`} className="inline-flex items-start leading-none">
              {part.trimStart()}
            </span>
          );
        }

        return (
          <span key={`${part}-${index}`} className="inline-grid min-w-[40px] grid-rows-[1em_auto] justify-items-center leading-none">
            <span className="block leading-none">lim</span>
            <span className={targetClassName}>x→{match[1]}</span>
          </span>
        );
      })}
    </div>
  );
}
