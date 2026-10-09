import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TOD: React.FC = () => {
  const { t } = useTranslation();
  const [wage, setWage] = useState<number | null>(null);
  const [isHourly, setIsHourly] = useState(true);

  const handleWageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWage(parseFloat(e.target.value));
  };

  const calculateWage = (percentage: number) => {
    const hourlyWage = isHourly ? wage : wage ? wage / (36 * 4) : 0; // Convert monthly wage to hourly wage
    return hourlyWage ? (hourlyWage * (1 + percentage / 100)).toFixed(2) : '0.00';
  };

  return (
    <section className="panel max-w-3xl p-6 sm:p-10" aria-labelledby="tod-title">
      <h2 id="tod-title" className="h3 mb-3">{t('tools.tod.title')}</h2>
      <p className="mb-8 text-muted">{t('tools.tod.description')}</p>
      <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl border border-line/15 p-1.5" role="group" aria-label={t('tools.tod.wagePerHour')}>
        {[true, false].map((hourly) => (
          <button
            key={String(hourly)}
            type="button"
            aria-pressed={isHourly === hourly}
            onClick={() => setIsHourly(hourly)}
            className={`min-h-[3rem] rounded-xl px-4 text-sm font-semibold transition-colors duration-300 ${
              isHourly === hourly ? 'bg-ink text-bg' : 'text-muted hover:bg-surface'
            }`}
          >
            {hourly ? t('tools.tod.hourlyWage') : t('tools.tod.monthlyWage')}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label htmlFor="wage" className="mb-2 block text-sm font-medium">
          {isHourly ? t('tools.tod.hourlyWage') : t('tools.tod.monthlyWage')}
        </label>
        <input
          type="number"
          id="wage"
          className="field"
          inputMode="decimal"
          value={wage ?? ''}
          onChange={handleWageChange}
          placeholder={t('tools.tod.enterWage', { type: isHourly ? 'hourly' : 'monthly' })}
        />
      </div>
      <div>
        <h3 className="label mb-4">{t('tools.tod.wagePerHour')}</h3>
        <ul className="divide-y divide-line/10 border-y border-line/10" aria-live="polite">
            {!isHourly && (
                <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
                <span>{t('tools.tod.shifts.baseSalary')}</span>
                <span className="font-mono font-semibold">€{calculateWage(0)}</span>
              </li>
            )}
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.weekdayEarlyMorning')}</span>
            <span className="font-mono font-semibold">€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.weekdayMorning')}</span>
            <span className="font-mono font-semibold">€{calculateWage(20)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.weekdayEvening')}</span>
            <span className="font-mono font-semibold">€{calculateWage(20)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.weekdayNight')}</span>
            <span className="font-mono font-semibold">€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.saturday')}</span>
            <span className="font-mono font-semibold">€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3 text-sm sm:text-base">
            <span>{t('tools.tod.shifts.sundayHoliday')}</span>
            <span className="font-mono font-semibold">€{calculateWage(65)}</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default TOD;