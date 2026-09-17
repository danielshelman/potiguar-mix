import { COLORS } from '../theme';
import { money, dateBr } from '../utils/format';
import StatusPill from './StatusPill';
import { useLookups } from '../lookups/LookupsContext';

function cellValue(col, row, lookups) {
  if (col.render) return col.render(row, lookups);
  const raw = row[col.key];
  if (col.type === 'money') return money(raw);
  if (col.type === 'date') return dateBr(raw);
  if (raw === null || raw === undefined || raw === '') return '—';
  return String(raw);
}

export default function DataTable({ columns, rows, onRowClick, sortKey, sortDir, onSort }) {
  const lookups = useLookups();

  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 4, overflowX: 'auto', overflowY: 'hidden' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort?.(col.key)}
                style={{
                  padding: '11px 16px',
                  textAlign: col.align || 'left',
                  fontSize: 11.5,
                  color: COLORS.textMuted,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  cursor: onSort ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
                {sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              style={{ borderTop: `1px solid ${COLORS.borderLight}`, cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '11px 16px', fontSize: 13, color: COLORS.text, textAlign: col.align || 'left' }}>
                  {col.type === 'status' ? <StatusPill status={row[col.key]} /> : cellValue(col, row, lookups)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
