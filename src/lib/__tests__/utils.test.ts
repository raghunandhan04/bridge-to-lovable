import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges Tailwind classes with last-one-wins for conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-left', 'text-center')).toBe('text-center');
  });

  it('handles falsy values and arrays/objects like clsx', () => {
    const classes = cn('m-1', undefined as any, false as any, null as any, ['px-2', { 'font-bold': true, 'font-light': false }]);
    expect(classes.split(' ')).toEqual(expect.arrayContaining(['m-1', 'px-2', 'font-bold']));
    expect(classes).not.toContain('font-light');
  });

  it('deduplicates utilities correctly', () => {
    const result = cn('px-2', 'px-4', 'py-2', 'py-2');
    expect(result.includes('px-4')).toBe(true);
    expect(result.includes('px-2')).toBe(false);
  });
});
