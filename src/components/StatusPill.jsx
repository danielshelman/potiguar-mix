import { statusColor } from '../theme';

export default function StatusPill({ status }) {
  if (!status) return <span>—</span>;
  const c = statusColor(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: c }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />
      {status}
    </span>
  );
}
