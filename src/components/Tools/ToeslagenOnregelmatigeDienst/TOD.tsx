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
    <div className="p-6 bg-gray-900/50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">{t('tools.tod.title')}</h1>
      <div className="mb-6 flex space-x-4">
        <div
          className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
            isHourly ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'
          }`}
          onClick={() => setIsHourly(true)}
        >
          <h2 className="text-xl font-semibold text-center">{t('tools.tod.hourlyWage')}</h2>
        </div>
        <div
          className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
            !isHourly ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'
          }`}
          onClick={() => setIsHourly(false)}
        >
          <h2 className="text-xl font-semibold text-center">{t('tools.tod.monthlyWage')}</h2>
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="wage" className="block text-lg font-medium text-gray-300 mb-2">
          {isHourly ? t('tools.tod.hourlyWage') : t('tools.tod.monthlyWage')}
        </label>
        <input
          type="number"
          id="wage"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg p-2"
          value={wage ?? ''}
          onChange={handleWageChange}
          placeholder={t('tools.tod.enterWage', { type: isHourly ? 'hourly' : 'monthly' })}
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('tools.tod.wagePerHour')}</h2>
        <ul className="space-y-2 text-lg text-gray-300">
            {!isHourly && (
                <li className="flex justify-between">
                <span>{t('tools.tod.shifts.baseSalary')}</span>
                <span>€{calculateWage(0)}</span>
              </li>
            )}
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.weekdayEarlyMorning')}</span>
            <span>€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.weekdayMorning')}</span>
            <span>€{calculateWage(20)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.weekdayEvening')}</span>
            <span>€{calculateWage(20)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.weekdayNight')}</span>
            <span>€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.saturday')}</span>
            <span>€{calculateWage(40)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t('tools.tod.shifts.sundayHoliday')}</span>
            <span>€{calculateWage(65)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TOD;