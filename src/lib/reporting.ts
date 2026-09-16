export const money = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2,
}).format(amount);

export const progressPercent = (current: number, target: number) =>
  target > 0 ? Math.min(100, Math.max(0, current / target * 100)) : 0;

export const errorMessage = (error: unknown, fallback = 'Please try again.') =>
  error instanceof Error ? error.message :
    error && typeof error === 'object' && 'message' in error ? String(error.message) : fallback;

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = String(value ?? '');
    const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [headers.map(escape).join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\r\n');
}
