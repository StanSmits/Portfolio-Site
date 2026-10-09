import React, { useState, useEffect } from 'react';
import { calculateWage } from '../../utils/wageCalculator';
import { ArrowBigRightDash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WageCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ total: number; details: string[] } | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const savedInput = localStorage.getItem('wageCalculatorInput');
    if (savedInput) {
      setShowContinue(true);
    }
  }, []);

  const handleCalculate = () => {
    const calculationResult = calculateWage(input);
    setResult(calculationResult);
    localStorage.setItem('wageCalculatorInput', input);
  };

  const handleContinue = () => {
    const savedInput = localStorage.getItem('wageCalculatorInput');
    if (savedInput) {
      setInput(savedInput);
      const calculationResult = calculateWage(savedInput);
      setResult(calculationResult);
      setShowContinue(false);
    }
  };

  const handleDismiss = () => {
    localStorage.removeItem('wageCalculatorInput');
    setShowContinue(false);
  };

  return (
    <div className="space-y-4">
      {showContinue && (
        <div className="flex items-center justify-between rounded-xl border border-line/15 bg-surface p-2 text-sm">
          <div className="flex-1 text-center">
            <button
              type="button"
              onClick={handleContinue}
              className="link-line inline-flex min-h-[2.75rem] items-center text-muted hover:text-ink"
            >
              { t("tools.calculator.continueWithLastResult") }
              <ArrowBigRightDash size={16} className="inline-block ml-1" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="icon-btn text-muted"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}
      <label htmlFor="wage-input" className="sr-only">
        { t("tools.calculator.textAreaPlaceholder") }
      </label>
      <textarea
        id="wage-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={ t("tools.calculator.textAreaPlaceholder") }
        className="field h-36 font-mono text-sm"
      />
      <button
        type="button"
        onClick={handleCalculate}
        className="btn btn-primary"
      >
        { t("tools.calculator.calculateWage") }
      </button>
      {result && (
        <div className="mt-4 rounded-xl border border-line/15 bg-surface/60 p-4" role="status">
          <div className="text-sm space-y-1">
            {result.details.map((detail, index) => (
              <p key={index} className="font-mono text-muted">{detail}</p>
            ))}
            <p className="mt-2 border-t border-line/15 pt-3 font-semibold">
              { t("tools.calculator.total") }  €{result.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};