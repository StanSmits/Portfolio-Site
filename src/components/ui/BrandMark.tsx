/** The site mark: three offset slabs, drawn from the stacked form of the 3D sculpture. */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect x="15" y="14" width="28" height="9" rx="3.5" fill="currentColor" />
      <rect x="21" y="27.5" width="30" height="9" rx="3.5" fill="currentColor" opacity="0.62" />
      <rect x="12" y="41" width="33" height="9" rx="3.5" fill="currentColor" opacity="0.86" />
    </svg>
  );
}
