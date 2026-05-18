export default function MetricCards({ analytics, loading }) {
  const cards = [
    {
      icon:  'ti-alert-triangle',
      label: 'Total errors',
      value: analytics?.total ?? '—',
      sub:   `${analytics?.open ?? 0} still open`,
      color: '#e8000d',
    },
    {
      icon:  'ti-circle-check',
      label: 'Resolved',
      value: analytics?.resolved ?? '—',
      sub:   `${analytics?.resolutionRate ?? 0}% resolution rate`,
      color: 'var(--color-text-success)',
    },
    {
      icon:  'ti-eye-off',
      label: 'Ignored',
      value: analytics?.ignored ?? '—',
      sub:   'manually dismissed',
      color: 'var(--color-text-secondary)',
    },
    {
      icon:  'ti-clock',
      label: 'Alert time',
      value: '<50ms',
      sub:   'via Socket.io',
      color: 'var(--color-text-info)',
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '14px 16px',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity .3s',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', color: 'var(--color-text-secondary)',
            marginBottom: '8px',
          }}>
            <i className={`ti ${card.icon}`} style={{ fontSize: '13px' }} aria-hidden="true" />
            {card.label}
          </div>
          <div style={{
            fontSize: '24px', fontWeight: 500,
            color: card.color, lineHeight: 1,
          }}>
            {loading ? '...' : card.value.toLocaleString?.() ?? card.value}
          </div>
          <div style={{
            fontSize: '11px', color: 'var(--color-text-secondary)',
            marginTop: '4px',
          }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  )
}