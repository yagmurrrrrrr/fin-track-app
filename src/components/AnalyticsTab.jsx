import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from './ui.jsx';
import { PIE_COLORS } from '../lib/constants.js';

// Recharts kendi CSS class'larıyla stillenmiyor, bu yüzden burada birkaç ham renk değeri tutuyoruz.
function useChartColors(isDarkMode) {
  return isDarkMode
    ? { grid: '#334155', text: '#94a3b8', tooltipBg: '#1e293b', tooltipBorder: '#334155' }
    : { grid: '#e2e8f0', text: '#64748b', tooltipBg: '#ffffff', tooltipBorder: '#e2e8f0' };
}

export default function AnalyticsTab({ t, isDarkMode, categoryBreakdown, monthlyTrend, assetAllocation, netWorth }) {
  const c = useChartColors(isDarkMode);
  const tooltipStyle = { background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, color: isDarkMode ? '#f8fafc' : '#1e293b' };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">📊 {t.catBreakdown}</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">{t.noData}</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toLocaleString()} ₺`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">💰 {t.assetAllocation}</h3>
          <p className="mb-2 mt-1 inline-block rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
            {t.netWorth}: <b>{netWorth.toLocaleString()} ₺</b>
          </p>
          {assetAllocation.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">{t.noData}</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetAllocation.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toLocaleString()} ₺`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">📈 {t.monthlyTrend}</h3>
        {monthlyTrend.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">{t.noData}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
              <XAxis dataKey="month" stroke={c.text} />
              <YAxis stroke={c.text} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toLocaleString()} ₺`} />
              <Legend />
              <Bar dataKey={t.incomeLbl} fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey={t.expenseLbl} fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}