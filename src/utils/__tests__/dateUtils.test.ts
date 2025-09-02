import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatRelativeDate } from '../dateUtils';

describe('Date Utilities', () => {
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
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
  const dateTime = '2024-01-15T14:30:00.000Z';
  const result = formatDateTime(dateTime);
  // Expect local timezone conversion; build expected string using Date
  const d = new Date(dateTime);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const expected = `${months[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  expect(result).toBe(expected);
    });
  });

  describe('formatRelativeDate', () => {
    it('should return "Just now" for recent dates', () => {
      const recentDate = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
      const result = formatRelativeDate(recentDate);
      expect(result).toBe('Just now');
    });

    it('should return hours for dates within 24 hours', () => {
      const hoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
      const result = formatRelativeDate(hoursAgo);
      expect(result).toBe('5 hours ago');
    });

    it('should return days for dates within a week', () => {
      const daysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = formatRelativeDate(daysAgo);
      expect(result).toBe('3 days ago');
    });

    it('should return formatted date for older dates', () => {
      const oldDate = new Date('2024-01-01T00:00:00.000Z');
      const result = formatRelativeDate(oldDate);
      expect(result).toBe('Jan 01, 2024');
    });
  });
});