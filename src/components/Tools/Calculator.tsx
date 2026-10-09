import React from 'react';
import { useTranslation } from 'react-i18next';
import { WageCalculator } from './WageCalculator';

const Calculator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="panel max-w-3xl p-6 sm:p-10" aria-labelledby="calculator-title">
      <h2 id="calculator-title" className="h3">
        {t('tools.calculator.title')}
      </h2>
      <p className="mb-8 mt-3 text-muted">{t('tools.calculator.description')}</p>
      <WageCalculator />
    </section>
  );
};

export default Calculator;
