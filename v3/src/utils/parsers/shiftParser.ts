import { ShiftData } from '../types/wage';

export const parseShiftLine = (line: string): ShiftData | null => {
  const dateTimeRegex = /(\d{2}-\d{2}-\d{4})\s+(Trainingsdag\s+)?(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/;
  const match = line.match(dateTimeRegex);
  
  if (!match) return null;
  
  const [_, dateStr, trainingDay, startTime, endTime] = match;
  const [day, month, year] = dateStr.split('-').map(Number);
  
  const createDateTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  return {
    date: new Date(year, month - 1, day),
    timeRange: {
      start: createDateTime(startTime),
      end: createDateTime(endTime),
    },
    type: trainingDay ? 'training' : 'regular',
  };
};