export function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export function formatCompactRupiah(value: number): string {
  if (Math.abs(value) >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} T`;
  }
  if (Math.abs(value) >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Jt`;
  }
  return formatRupiah(value);
}
