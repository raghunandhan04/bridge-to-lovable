import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';

// Simple date formatting utility function
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

describe('formatDate', () => {
  it('should format a date string correctly', () => {
    const dateString = '2024-01-15T10:30:00.000Z';
    const result = formatDate(dateString);
    expect(result).toBe('Jan 15, 2024');
  });

  it('should format a Date object correctly', () => {
    const date = new Date('2024-12-25T00:00:00.000Z');
    const result = formatDate(date);
    expect(result).toBe('Dec 25, 2024');
  });

  it('should handle leap year dates', () => {
    const leapYearDate = '2024-02-29T12:00:00.000Z';
    const result = formatDate(leapYearDate);
    expect(result).toBe('Feb 29, 2024');
  });

  it('should format current date', () => {
    const now = new Date();
    const result = formatDate(now);
    const expected = format(now, 'MMM dd, yyyy');
    expect(result).toBe(expected);
  });
});