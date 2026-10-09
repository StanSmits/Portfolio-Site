import type { ReactNode } from 'react';

interface SectionHeaderProps {
  id: string;
  index: string;
  label: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
}

/** Shared editorial header: index + label, large title, optional intro and an aside (scene anchor). */
export function SectionHeader({ id, index, label, title, intro, aside }: SectionHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className="col-span-12 md:col-span-7" data-reveal>
        <p className="label flex items-center gap-3">
          <span className="font-mono tracking-normal text-ink">{index}</span>
          <span className="h-px w-8 bg-line/40" aria-hidden="true" />
          {label}
        </p>
        <h2 id={id} className="h2 mt-6">
          {title}
        </h2>
        {intro && <p className="lead mt-6 max-w-[44ch]">{intro}</p>}
      </div>
      {aside}
    </div>
  );
}
