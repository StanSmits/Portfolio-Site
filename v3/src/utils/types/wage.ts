export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ShiftData {
  date: Date;
  timeRange: TimeRange;
  type?: 'training' | 'regular';
}

export interface WageCalculationResult {
  amount: number;
  detail: string;
  hours: number;
}

export interface WageSummary {
  total: number;
  details: string[];
  totalHours: number;
  regularHours: number;
  eveningHours: number;
  saturdayHours: number;
}