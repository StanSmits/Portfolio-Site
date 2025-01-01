import { WAGE_RATES } from '../constants/wages';
import { ShiftData, WageCalculationResult, WageSummary } from '../types/wage';
import { parseShiftLine } from '../parsers/shiftParser';



const calculateShiftWage = (shift: ShiftData): WageCalculationResult => {
  let totalWage = 0;
  let totalHours = 0;
  const { start, end } = shift.timeRange;
  const isSaturday = start.getDay() === 6;
  
  if (isSaturday) {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    totalWage = hours * WAGE_RATES.SATURDAY;
    return {
      amount: totalWage,
      hours,
      detail: `${start.toLocaleDateString()}: ${hours.toFixed(2)}h @ €${WAGE_RATES.SATURDAY}/h = €${totalWage.toFixed(2)} (Saturday)`,
    };
  }

  let currentTime = new Date(start);
  const evening = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 18, 0);
  let regularHours = 0;
  let eveningHours = 0;
  
  while (currentTime < end) {
    const hourEnd = new Date(Math.min(end.getTime(), currentTime.getTime() + (60 * 60 * 1000)));
    const hourDuration = (hourEnd.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    
    let rate = WAGE_RATES.BASE;
    if (currentTime >= evening) {
      rate += WAGE_RATES.EVENING_BONUS_AFTER_18;
      eveningHours += hourDuration;
    } else {
      rate += WAGE_RATES.EVENING_BONUS_BEFORE_18;
      regularHours += hourDuration;
    }
    
    totalWage += hourDuration * rate;
    totalHours += hourDuration;
    currentTime = hourEnd;
  }

  const detail = `${start.toLocaleDateString()}: ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()} = €${totalWage.toFixed(2)} (${totalHours.toFixed(2)}h)`;
  return { amount: totalWage, hours: totalHours, detail };
};

export const calculateWage = (input: string): WageSummary => {
  const lines = input.trim().split('\n');
  let total = 0;
  let totalHours = 0;
  let regularHours = 0;
  let eveningHours = 0;
  let saturdayHours = 0;
  const details: string[] = [];

  lines.forEach(line => {
    if (!line.trim()) return;
    
    const shiftData = parseShiftLine(line);
    if (!shiftData) {
      details.push(`Could not parse line: ${line}`);
      return;
    }

    const { amount, hours, detail } = calculateShiftWage(shiftData);
    total += amount;
    totalHours += hours;
    
    if (shiftData.date.getDay() === 6) {
      saturdayHours += hours;
    } else {
      const evening = new Date(shiftData.date);
      evening.setHours(18, 0, 0, 0);
      if (shiftData.timeRange.end <= evening) {
        regularHours += hours;
      } else if (shiftData.timeRange.start >= evening) {
        eveningHours += hours;
      } else {
        const eveningDiff = (shiftData.timeRange.end.getTime() - evening.getTime()) / (1000 * 60 * 60);
        eveningHours += eveningDiff;
        regularHours += hours - eveningDiff;
      }
    }
    
    details.push(detail);
  });

  return {
    total,
    details,
    totalHours,
    regularHours,
    eveningHours,
    saturdayHours,
  };
};