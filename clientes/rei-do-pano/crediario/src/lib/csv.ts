// CSV com BOM UTF-8. ';' abre direto no Excel em português; ',' serve para Meta Ads e outras ferramentas.

export type CsvColumn<T> = { header: string; value: (row: T) => string | number | boolean | null | undefined };

function escapeCell(value: unknown, sep: string): string {
  const s = value === null || value === undefined ? '' : String(value);
  // Evita fórmula injetada ao abrir no Excel.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /["\n\r]/.test(safe) || safe.includes(sep) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[], sep: ';' | ','): string {
  const lines = [columns.map((c) => escapeCell(c.header, sep)).join(sep)];
  for (const row of rows) lines.push(columns.map((c) => escapeCell(c.value(row), sep)).join(sep));
  return '﻿' + lines.join('\r\n');
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
