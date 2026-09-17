export function money(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export function moneyShort(v) {
  const n = Number(v) || 0;
  const abs = Math.abs(n);
  const s = abs >= 1000 ? (abs / 1000).toFixed(1).replace('.', ',') + 'k' : abs.toFixed(0);
  return (n < 0 ? '-' : '') + 'R$ ' + s;
}

export function dateBr(v) {
  if (!v) return '—';
  const s = typeof v === 'string' ? v : new Date(v).toISOString();
  const datePart = s.slice(0, 10);
  const p = datePart.split('-');
  if (p.length !== 3) return s;
  return `${p[2]}/${p[1]}/${p[0]}`;
}

export function dateTimeBr(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString('pt-BR');
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
