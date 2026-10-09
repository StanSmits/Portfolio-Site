import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const label = theme === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark');
  return (
    <button type="button" className={`icon-btn ${className}`} onClick={toggleTheme} aria-label={label} title={label}>
      <span className="relative block h-5 w-5" aria-hidden="true">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
          }`}
          strokeWidth={1.6}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${
            theme === 'dark' ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          strokeWidth={1.6}
        />
      </span>
    </button>
  );
}
