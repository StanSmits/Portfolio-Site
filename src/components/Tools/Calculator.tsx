import React from 'react';
import { useTranslation } from 'react-i18next';
import { WageCalculator } from './WageCalculator';

const Calculator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">{t('tools.calculator.title')}</h2>
      <p className="text-gray-400 mb-4">{t('tools.calculator.description')}</p>
      <WageCalculator />
    </div>
  );
};

export default Calculator;
