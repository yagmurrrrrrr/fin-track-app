import { Card, Button } from './ui.jsx';

const ASSET_ICONS = { dolar: '💵', euro: '💶', altin: '🟡' };
const ASSET_STYLES = {
  dolar: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  euro: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  altin: 'from-amber-500/15 to-amber-500/5 border-amber-500/20'
};

export default function DashboardTab({ t, wallet, limits, transactions, onOpenIncome, onOpenExpense, onViewAll }) {
  const isFirstRun = transactions.length === 0;
  const recent = transactions.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      {isFirstRun && (
        <Card className="relative overflow-hidden border-cyan-200 bg-cyan-50/60 dark:border-cyan-500/20 dark:bg-cyan-500/5 lg:col-span-2">
          <div className="flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">👋</span>
            <div>
              <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">{t.dashboardWelcomeTitle}</p>
              <p className="text-sm text-cyan-700/80 dark:text-cyan-400/80">{t.dashboardWelcomeHint}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-700 to-cyan-900 text-white dark:from-cyan-700 dark:to-slate-900">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-sm font-semibold uppercase tracking-wide text-cyan-50">{t.totalBalance}</p>
          <h1 className="relative my-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {wallet.bakiye.toLocaleString()} ₺
          </h1>
          <div className="relative mt-4 flex flex-wrap gap-3">
            <Button variant="success" className="shadow-md shadow-emerald-900/20 hover:-translate-y-0.5" onClick={onOpenIncome}>+ {t.income}</Button>
            <Button variant="danger" className="shadow-md shadow-red-900/20 hover:-translate-y-0.5" onClick={onOpenExpense}>− {t.expense}</Button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">{t.assets}</h3>
          <div className="grid grid-cols-3 gap-3">
            {['dolar', 'euro', 'altin'].map(asset => (
              <div
                key={asset}
                className={`rounded-xl border bg-gradient-to-br p-5 text-center transition-transform duration-200 hover:-translate-y-0.5 ${ASSET_STYLES[asset]}`}
              >
                <span className="text-xl" aria-hidden="true">{ASSET_ICONS[asset]}</span>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{asset.toUpperCase()}</p>
                <b className="text-slate-900 dark:text-slate-50">{wallet[asset]}</b>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{t.recentTransactions}</h3>
            {onViewAll && recent.length > 0 && (
              <button
                onClick={onViewAll}
                className="rounded-lg px-2 py-1 text-xs font-medium text-cyan-600 transition-colors hover:bg-cyan-50 hover:underline dark:text-cyan-400 dark:hover:bg-cyan-500/10"
              >
                {t.viewAll} →
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-6 text-center">
              <span className="text-2xl" aria-hidden="true">🧾</span>
              <p className="text-sm text-slate-400 dark:text-slate-500">{t.noData}</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
              {recent.map(tr => {
                const positive = tr.amount > 0;
                return (
                  <div key={tr.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-800 dark:text-slate-100">{tr.desc}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{tr.date}</p>
                    </div>
                    <span className={`flex-shrink-0 text-sm font-semibold ${positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {positive ? '+' : ''}{tr.amount}₺
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">{t.limitStatus}</h3>
        <div className="flex flex-col gap-5">
          {Object.keys(limits).map(cat => {
            const spent = Math.abs(
              transactions.filter(tr => tr.cat === cat && tr.amount < 0).reduce((a, b) => a + b.amount, 0)
            );
            const limit = limits[cat];
            const percent = Math.min((spent / limit) * 100, 100);
            const isOver = spent >= limit;
            return (
              <div key={cat}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{t[cat]}</span>
                  <span className={isOver ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
                    {spent.toLocaleString()} / {limit.toLocaleString()} ₺
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out ${
                      isOver ? 'from-red-500 to-red-400' : 'from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {isOver && <small className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">⚠️ Limit Aşıldı!</small>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}