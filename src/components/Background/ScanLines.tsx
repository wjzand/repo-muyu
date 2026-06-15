export function ScanLines() {
  return (
    <div
      className="scanlines fixed inset-0 pointer-events-none z-[80] opacity-50"
      aria-hidden
    />
  );
}

export function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden />;
}
