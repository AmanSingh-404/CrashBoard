import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekChart({ data = [] }) {
  // fill missing days with 0
  const chartData = DAYS.map((day, i) => {
    const found = data.find(d => {
      const date = new Date(d._id)
      return date.getDay() === (i + 1) % 7
    })
    return { day, count: found?.count || 0 }
  })

  const max = Math.max(...chartData.map(d => d.count), 1)

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '14px 16px',
    }}>
      <div style={{
        fontSize: '13px', fontWeight: 500,
        color: 'var(--color-text-primary)',
        marginBottom: '14px',
      }}>
        Errors this week
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={chartData} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: '6px', fontSize: '11px',
            }}
            cursor={{ fill: 'var(--color-background-secondary)' }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.count === max ? '#e8000d' : 'var(--color-background-danger)'}
                opacity={entry.count === max ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}