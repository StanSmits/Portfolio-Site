/** Minimal, non-blocking placeholder for lazily loaded routes. */
export function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line/20 border-t-ink" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
