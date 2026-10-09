import type { CSSProperties } from 'react';
import type { Project } from '../../content/types';

/**
 * Drawn illustrations of each product. They describe the interface structure;
 * they are intentionally abstract and are labelled as illustrations, not screenshots.
 */
export function ProjectVisual({ visual }: { visual: Project['visual'] }) {
  switch (visual) {
    case 'rvw':
      return <RvwIllustration />;
    case 'tod':
      return <TodIllustration />;
    case 'wage':
      return <WageIllustration />;
    case 'site':
      return <SiteIllustration />;
  }
}

const bar = (width: string, extra = ''): JSX.Element => (
  <span className={`block h-2 rounded-full bg-ink/15 ${extra}`} style={{ width }} />
);

function RvwIllustration() {
  return (
    <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
      {/* Search pane */}
      <div className="absolute left-[5%] top-[6%] w-[70%] rounded-2xl sm:left-[6%] sm:top-[9%] sm:w-[52%] border border-line/10 bg-bg-elevated p-4 shadow-[var(--card-shadow)] depth-1">
        <div className="flex items-center gap-2 rounded-xl border border-line/15 bg-bg px-3 py-2.5">
          <span className="h-3 w-3 rounded-full border-2 border-ink/40" />
          {bar('42%')}
        </div>
        <ul className="mt-3 space-y-2">
          {[0.78, 0.6, 0.7].map((w, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-lg px-2 py-2 ${i === 0 ? 'bg-surface' : ''}`}
            >
              <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold text-bg">
                {['R', 'F', 'N'][i]}
              </span>
              {bar(`${w * 100}%`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Form pane */}
      <div className="absolute right-[4%] top-[34%] w-[66%] rounded-2xl sm:right-[5%] sm:top-[22%] sm:w-[48%] border border-line/10 bg-bg-elevated p-4 shadow-[var(--card-shadow)] depth-2">
        <p className="label !text-[0.55rem]">Feitcode</p>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-line/15 px-3 py-2">{bar('55%')}</div>
          <div className="flex items-center justify-between rounded-lg border border-line/15 px-3 py-2">
            {bar('40%')}
            <span className="h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-ink/50" />
          </div>
          <div className="flex gap-3">
            {[true, false].map((on, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={`grid h-3 w-3 place-items-center rounded-full border border-ink/40`}>
                  {on && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                </span>
                {bar('2.2rem')}
              </span>
            ))}
          </div>
          {/* A conditional field, revealed by the answer above */}
          <div className="rounded-lg border border-dashed border-accent/50 px-3 py-2">{bar('62%', '!bg-accent/30')}</div>
        </div>
      </div>

      {/* Output pane */}
      <div className="absolute bottom-[5%] left-[5%] w-[62%] rounded-2xl bg-ink sm:bottom-[7%] sm:left-[14%] sm:w-[60%] p-4 text-bg shadow-[var(--card-shadow)] depth-2">
        <div className="space-y-2">
          {['92%', '86%', '95%', '60%'].map((w, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-bg/30" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <span className="rounded-full bg-bg px-3 py-1 text-[0.55rem] font-semibold text-ink">Copy</span>
        </div>
      </div>
    </div>
  );
}

const TOD_BANDS = [0, 40, 20, 20, 40, 40, 65];

function TodIllustration() {
  return (
    <div className="flex h-full items-end gap-[6%] px-[10%] pb-[14%] pt-[18%]" aria-hidden="true">
      {TOD_BANDS.map((pct, i) => (
        <span key={i} className="flex flex-1 flex-col items-center gap-2">
          <span
            className={`w-full rounded-t-md ${pct >= 65 ? 'bg-accent/70' : 'bg-ink/20'}`}
            style={{ height: `${(100 + pct) * 0.42}px` }}
          />
          <span className="font-mono text-[0.55rem] text-subtle">+{pct}</span>
        </span>
      ))}
    </div>
  );
}

function WageIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-[12%] font-mono text-[0.6rem] text-muted" aria-hidden="true">
      {['11:45–20:04', '07:30–16:10', '12:00–21:15'].map((line, i) => (
        <span key={i} className="flex items-center justify-between border-b border-line/10 pb-2">
          <span>{line}</span>
          {bar(`${30 + i * 8}%`)}
        </span>
      ))}
      <span className="mt-1 flex items-center justify-between font-semibold text-ink">
        <span>Σ</span>
        <span className="h-2 w-16 rounded-full bg-ink/60" />
      </span>
    </div>
  );
}

function SiteIllustration() {
  return (
    <div className="grid h-full place-items-center" aria-hidden="true">
      <div className="sculpture scale-75" style={{ '--size': '9rem', width: '9rem' } as CSSProperties}>
        <div className="sculpture-stack">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="sculpture-slab" style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
}
