import { Card } from './Common';
import { COLORS } from '../theme';

export function KpiGrid({ kpis }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 20 }}>
      {kpis.map((k) => (
        <Card key={k.label} style={{ padding: '18px 18px 16px' }}>
          <div style={{ fontSize: 11.5, color: COLORS.textMuted, fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {k.label}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 8, color: k.color || COLORS.text, lineHeight: 1.25 }}>{k.value}</div>
          {k.sub && <div style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 6 }}>{k.sub}</div>}
        </Card>
      ))}
    </div>
  );
}

export function PanelList({ title, items }) {
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {items.length === 0 && <div style={{ fontSize: 12.5, color: COLORS.textFaint }}>Nada por aqui.</div>}
      {items.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: `1px solid ${COLORS.borderLight}` }}>
          <div style={{ width: 4, flexShrink: 0, borderRadius: 2, background: a.color || COLORS.primary }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 2 }}>{a.detail}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function TwoPanelRow({ left, right }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <PanelList title={left.title} items={left.items} />
      <PanelList title={right.title} items={right.items} />
    </div>
  );
}
