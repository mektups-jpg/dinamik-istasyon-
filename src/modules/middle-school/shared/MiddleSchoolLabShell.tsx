import type { ReactNode } from 'react';
import { GameHeader } from '../../../components/ui/GameHeader';

export type MiddleSchoolLabTone = 'cyan' | 'green' | 'purple' | 'pink' | 'amber';

export interface MiddleSchoolLabBadge {
  label: string;
  value: string;
  tone?: MiddleSchoolLabTone;
}

interface MiddleSchoolLabShellProps {
  title: string;
  subtitle: string;
  badges?: MiddleSchoolLabBadge[];
  rightContent?: ReactNode;
  children: ReactNode;
  frameClassName?: string;
  contentClassName?: string;
}

const badgeToneClass: Record<MiddleSchoolLabTone, string> = {
  cyan: 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#9ff5ff]',
  green: 'border-[#00FF88]/30 bg-[#00FF88]/10 text-[#b8ffd8]',
  purple: 'border-[#B388FF]/30 bg-[#B388FF]/10 text-[#dfc9ff]',
  pink: 'border-[#FF4FA3]/30 bg-[#FF4FA3]/10 text-[#ffc0dc]',
  amber: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

export function MiddleSchoolLabShell({
  title,
  subtitle,
  badges = [],
  rightContent,
  children,
  frameClassName = 'bg-[#030711] [background-image:radial-gradient(circle_at_18%_10%,rgba(0,229,255,0.16),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(179,136,255,0.12),transparent_28%),linear-gradient(135deg,#06111f_0%,#111827_48%,#1d1230_100%)]',
  contentClassName = 'max-w-7xl px-4 py-5 pb-28 sm:px-6 lg:px-8',
}: MiddleSchoolLabShellProps) {
  return (
    <div className={`h-full min-h-screen w-full overflow-x-hidden overflow-y-auto text-white selection:bg-[#00E5FF] selection:text-[#030711] ${frameClassName}`}>
      <GameHeader
        title={title}
        subtitle={subtitle}
        rightContent={
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              {badges.map((badge) => (
                <div
                  key={`${badge.label}-${badge.value}`}
                  className={`rounded-xl border px-3 py-2 text-right shadow-[0_10px_24px_rgba(0,0,0,0.20)] ${badgeToneClass[badge.tone ?? 'cyan']}`}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">{badge.label}</p>
                  <p className="text-lg font-black leading-none">{badge.value}</p>
                </div>
              ))}
            </div>
            {rightContent}
          </div>
        }
      />

      <main className={`relative z-10 mx-auto w-full ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
}
