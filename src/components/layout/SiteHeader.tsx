import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NAV_ITEMS, PROFILE } from '../../content/profile';
import { useLang } from '../../i18n/useLang';
import { useActiveSection } from '../../hooks/useActiveSection';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';
import { SectionLink } from './NavLink';
import { BrandMark } from '../ui/BrandMark';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function SiteHeader() {
  const { t } = useTranslation();
  const { pick } = useLang();
  const { pathname } = useLocation();
  const active = useActiveSection(pathname === '/' ? SECTION_IDS : []);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    const first = focusables()[0];
    window.setTimeout(() => first?.focus(), 50);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const onChange = () => media.matches && setOpen(false);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? 'border-b border-line/10 bg-bg/90' : 'border-b border-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <SectionLink id="top" className="group flex items-center gap-3 font-display text-[1.05rem] font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-line/20 transition-colors duration-300 group-hover:bg-ink group-hover:text-bg">
            <BrandMark className="h-6 w-6 transition-transform duration-500 ease-out group-hover:scale-110" />
          </span>
          <span>{PROFILE.name}</span>
          <span className="sr-only">— home</span>
        </SectionLink>

        <nav aria-label={t('nav.primary')} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <SectionLink
                  id={item.id}
                  current={active === item.id}
                  className={`relative flex min-h-[2.75rem] items-center px-3 text-sm font-medium transition-colors duration-300 ${
                    active === item.id ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {pick(item.label)}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink transition-all duration-500 ${
                      active === item.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  />
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`menu-panel md:hidden ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        aria-hidden={!open}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <span className="label">{t('nav.menu')}</span>
          <button type="button" className="icon-btn" onClick={() => close()} aria-label={t('nav.closeMenu')}>
            <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label={t('nav.primary')} className="shell flex flex-1 flex-col justify-center">
          <ol className="space-y-2">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.id} className="menu-item" style={{ '--i': index } as React.CSSProperties}>
                <SectionLink
                  id={item.id}
                  current={active === item.id}
                  onNavigate={() => close(false)}
                  className="flex items-baseline gap-4 py-2 font-display text-[clamp(2.5rem,12vw,4rem)] font-semibold leading-none tracking-tight"
                >
                  <span className="label w-6 text-subtle">0{index + 1}</span>
                  {pick(item.label)}
                </SectionLink>
              </li>
            ))}
          </ol>
        </nav>
        <div className="shell menu-item pb-8 pt-6" style={{ '--i': NAV_ITEMS.length } as React.CSSProperties}>
          <div className="hairline mb-6" />
          <a href={`mailto:${PROFILE.email}`} className="link-line text-lg font-medium">
            {PROFILE.email}
          </a>
        </div>
      </div>
    </header>
  );
}
