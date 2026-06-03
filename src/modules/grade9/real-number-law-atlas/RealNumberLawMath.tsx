import { Fragment, type ReactNode } from 'react';

type RadicalSize = 'display' | 'inline';

export function RadicalNumber({ value, size = 'inline' }: { value: number; size?: RadicalSize }) {
  const isDisplay = size === 'display';

  return (
    <span className={`inline-grid place-items-center align-middle ${isDisplay ? 'h-[62px] w-[104px]' : 'mx-0.5 h-[1.45em] w-[2.15em] translate-y-[0.18em]'}`} aria-label={`kök ${value}`}>
      <svg className="h-full w-full overflow-visible" viewBox={isDisplay ? '0 0 104 64' : '0 0 54 36'} role="img" aria-hidden="true">
        <path
          d={isDisplay ? 'M6 35 H19 L30 57 L48 12 H99' : 'M4 19 H10 L16 32 L26 7 H51'}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isDisplay ? 5 : 3.2}
        />
        <text
          x={isDisplay ? 62 : 33}
          y={isDisplay ? 50 : 29}
          fill="currentColor"
          fontFamily="inherit"
          fontSize={isDisplay ? 42 : 24}
          fontWeight="900"
          textAnchor="middle"
        >
          {value}
        </text>
      </svg>
      <span className="sr-only">√{value}</span>
    </span>
  );
}

export function RadicalTwo({ size = 'inline' }: { size?: RadicalSize }) {
  return <RadicalNumber value={2} size={size} />;
}

export function mathTextWithRadicals(text: string): ReactNode {
  const matches = [...text.matchAll(/√(\d+)/g)];
  if (matches.length === 0) return text;

  let cursor = 0;
  return (
    <>
      {matches.map((match, index) => {
        const start = match.index ?? 0;
        const value = Number(match[1]);
        const plainText = text.slice(cursor, start);
        cursor = start + match[0].length;

        return (
          <Fragment key={`${match[0]}-${start}-${index}`}>
            {plainText}
            <RadicalNumber value={value} />
          </Fragment>
        );
      })}
      {text.slice(cursor)}
    </>
  );
}

export function mathTextWithRootTwo(text: string): ReactNode {
  return mathTextWithRadicals(text);
}
