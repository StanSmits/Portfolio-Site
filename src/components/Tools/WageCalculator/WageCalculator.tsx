import React, { useState } from 'react';
import { calculateWage } from '../../../utils/calculations/wageCalculator';
import { WageCalculatorInput } from './WageCalculatorInput';
import { WageCalculatorResults } from './WageCalculatorResults';
import type { WageSummary } from '../../../utils/types/wage';

export const WageCalculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<WageSummary | null>(null);

  const handleCalculate = () => {
    const calculationResult = calculateWage(input);
    setResult(calculationResult);
  };

  return (
    <div className="space-y-4">
      <WageCalculatorInput value={input} onChange={setInput} />
      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition-colors"
      >
        Calculate Wage
      </button>
      {result && <WageCalculatorResults result={result} />}
    </div>
  );
};