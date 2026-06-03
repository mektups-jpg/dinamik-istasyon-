import type { ReactNode } from 'react';
import type { RootChallenge } from './types';

interface InlineRadicalProps {
  children: ReactNode;
  className?: string;
}

export function InlineRadical({ children, className = '' }: InlineRadicalProps) {
  const label = typeof children === 'string' || typeof children === 'number' ? String(children) : 'ifade';

  return (
    <span className={`inline-flex items-end align-[-0.12em] ${className}`} aria-label={`karekök ${label}`}>
      <span aria-hidden="true" className="-mr-[0.08em] text-[1.2em] leading-none">
        √
      </span>
      <span className="relative inline-flex whitespace-nowrap px-[0.18em] pt-[0.22em] leading-none before:absolute before:left-0 before:right-0 before:top-0 before:h-[0.12em] before:min-h-[2px] before:rounded-full before:bg-current">
        {children}
      </span>
    </span>
  );
}

export function InlineRootSetup({ challenge }: { challenge: RootChallenge }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 whitespace-nowrap">
      <InlineRadical>{challenge.radicand}</InlineRadical>
      <span>=</span>
      <InlineRadical>{`${challenge.squareFactor} · ${challenge.remainder}`}</InlineRadical>
    </span>
  );
}

export function InlineRootResult({ challenge }: { challenge: RootChallenge }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 whitespace-nowrap">
      <InlineRadical>{challenge.radicand}</InlineRadical>
      <span>=</span>
      <span>{challenge.outsideFactor}</span>
      <InlineRadical>{challenge.remainder}</InlineRadical>
    </span>
  );
}
