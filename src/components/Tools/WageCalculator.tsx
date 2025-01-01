import React, { useState, useEffect } from 'react';
import { calculateWage } from '../../utils/wageCalculator';
import { ArrowBigRightDash } from 'lucide-react';

export const WageCalculator: React.FC = () => {
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
        <div className="bg-purple-200 p-2 m-2 rounded-md text-sm flex justify-between items-center">
          <div className="flex-1 text-center">
            <button
              onClick={handleContinue}
              className="relative text-gray-600 hover:text-gray-800 duration-300 transition-colors font-light after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              Continue with your last result?
              <ArrowBigRightDash size={16} className="inline-block ml-1" />
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            &times;
          </button>
        </div>
      )}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter shift times (e.g., 10-12-2024 11:45-20:04)"
        className="w-full h-32 bg-gray-800/50 rounded-md p-2 text-sm text-gray-300 placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      />
      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition-colors"
      >
        Calculate Wage
      </button>
      {result && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-md">
          <div className="text-sm space-y-1">
            {result.details.map((detail, index) => (
              <p key={index} className="text-gray-300">{detail}</p>
            ))}
            <p className="text-purple-400 font-medium pt-2 border-t border-gray-700">
              Total: €{result.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};