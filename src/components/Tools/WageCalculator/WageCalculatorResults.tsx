import React from 'react';
import { WageSummary } from '../../../utils/types/wage';

interface Props {
  result: WageSummary;
}

export const WageCalculatorResults: React.FC<Props> = ({ result }) => (
  <div className="mt-4 p-3 bg-gray-800/50 rounded-md">
    <div className="text-sm space-y-1">
      {result.details.map((detail, index) => (
        <p key={index} className="text-gray-300">{detail}</p>
      ))}
      <div className="pt-2 mt-2 border-t border-gray-700 space-y-1">
        <p className="text-gray-300">Regular hours: {result.regularHours.toFixed(2)}h</p>
        <p className="text-gray-300">Evening hours: {result.eveningHours.toFixed(2)}h</p>
        <p className="text-gray-300">Saturday hours: {result.saturdayHours.toFixed(2)}h</p>
        <p className="text-gray-300">Total hours: {result.totalHours.toFixed(2)}h</p>
        <p className="text-purple-400 font-medium">Total: €{result.total.toFixed(2)}</p>
      </div>
    </div>
  </div>
);