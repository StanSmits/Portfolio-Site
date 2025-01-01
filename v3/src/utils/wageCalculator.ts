interface TimeRange {
  start: Date;
  end: Date;
}

interface ShiftData {
  date: Date;
  timeRange: TimeRange;
}

const RATES = {
  BASE: 14.45,
  EVENING_BONUS: 0.75,
  NIGHT_BONUS: 3.44,
  SATURDAY: 21.66,
};

const parseShiftLine = (line: string): ShiftData | null => {
  const dateTimeRegex = /(\d{2}-\d{2}-\d{4})\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/;
  const match = line.match(dateTimeRegex);
  
  if (!match) return null;
  
  const [_, dateStr, startTime, endTime] = match;
  const [day, month, year] = dateStr.split('-').map(Number);
  
  const createDateTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return date;
  };

  return {
    date: new Date(year, month - 1, day),
    timeRange: {
      start: createDateTime(startTime),
      end: createDateTime(endTime),
    },
  };
};

const calculateShiftWage = (shift: ShiftData): { amount: number; detail: string } => {
  let totalWage = 0;
  const { start, end } = shift.timeRange;
  const isSaturday = start.getDay() === 6;
  
  if (isSaturday) {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    totalWage = hours * RATES.SATURDAY;
    return {
      amount: totalWage,
      detail: `${start.toLocaleDateString()}: ${hours.toFixed(2)}h @ €${RATES.SATURDAY}/h = €${totalWage.toFixed(2)} (Saturday rate)`,
    };
  }

  let currentTime = new Date(start);
  let evening = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 18, 0);
  
  while (currentTime < end) {
    const hourEnd = new Date(Math.min(end.getTime(), currentTime.getTime() + (60 * 60 * 1000)));
    const hourDuration = (hourEnd.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    
    let rate = RATES.BASE;
    if (currentTime >= evening) {
      rate += RATES.NIGHT_BONUS;
    } else {
      rate += RATES.EVENING_BONUS;
    }
    
    totalWage += hourDuration * rate;
    currentTime = hourEnd;
  }

  return {
    amount: totalWage,
    detail: `${start.toLocaleDateString()}: ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()} = €${totalWage.toFixed(2)}`,
  };
};

export const calculateWage = (input: string) => {
  const lines = input.trim().split('\n');
  let total = 0;
  const details: string[] = [];

  lines.forEach(line => {
    if (!line.trim()) return;
    
    const shiftData = parseShiftLine(line);
    if (!shiftData) {
      details.push(`Could not parse line: ${line}`);
      return;
    }

    const { amount, detail } = calculateShiftWage(shiftData);
    total += amount;
    details.push(detail);
  });

  return { total, details };
};