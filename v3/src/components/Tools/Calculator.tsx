import React from 'react';
import { WageCalculator } from './WageCalculator';

export const Calculator: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Wage calculator for Amazon</h2>
      <p className="text-gray-400 mb-4">
        Quick way to calculate the amount of pay that I'd recieve while working at Amazon.
      </p>
      <WageCalculator />
    </div>
  );
};