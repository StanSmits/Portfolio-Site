import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const WageCalculatorInput: React.FC<Props> = ({ value, onChange }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Enter shift times (e.g., 10-12-2024 11:45-20:04)"
    className="w-full h-32 bg-gray-800/50 rounded-md p-2 text-sm text-gray-300 placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
  />
);