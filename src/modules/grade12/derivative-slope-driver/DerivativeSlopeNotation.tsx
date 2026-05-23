export function DeltaFraction({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex translate-y-[0.14em] flex-col items-center justify-center align-middle font-black leading-none ${
        compact ? 'mx-0.5 text-[0.9em]' : 'mx-1 text-[0.95em]'
      }`}
      aria-label="delta y bölü delta x"
    >
      <span>Δy</span>
      <span className="my-[0.08em] h-[2px] w-full rounded-full bg-current" />
      <span>Δx</span>
    </span>
  );
}

export function SlopeExpressionText({ expression }: { expression: string }) {
  if (expression === 'ortalama değişim = Δy / Δx') {
    return (
      <>
        ortalama değişim = <DeltaFraction />
      </>
    );
  }

  return <>{expression}</>;
}

export function SlopeLabelText({ label }: { label: string }) {
  if (label.startsWith('Δy / Δx')) {
    const suffix = label.replace('Δy / Δx', '').trim();

    return (
      <>
        <DeltaFraction compact /> {suffix}
      </>
    );
  }

  return <>{label}</>;
}
