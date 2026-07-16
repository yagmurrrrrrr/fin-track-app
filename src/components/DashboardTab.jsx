import { Card, Button } from './ui.jsx';

const ASSET_ICONS = { dolar: '💵', euro: '💶', altin: '🟡' };
const ASSET_STYLES = {
  dolar: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  euro: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  altin: 'from-amber-500/15 to-amber-500/5 border-amber-500/20'
};

export default function DashboardTab({ t, wallet, limits, transactions, onOpenIncome, onOpenExpense }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-600 to-cyan-800 text-white dark:from-cyan-500 dark:to-slate-900">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-sm font-semibold text-cyan-100">{t.totalBalance}</p>
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
                className={`rounded-xl border bg-gradient-to-br p-4 text-center transition-transform duration-200 hover:-translate-y-0.5 ${ASSET_STYLES[asset]}`}
              >
                <span className="text-xl" aria-hidden="true">{ASSET_ICONS[asset]}</span>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{asset.toUpperCase()}</p>
                <b className="text-slate-900 dark:text-slate-50">{wallet[asset]}</b>
              </div>
            ))}
          </div>
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
                  <span className={isOver ? 'font-semibold text-red-500' : 'text-slate-500 dark:text-slate-400'}>
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
                {isOver && <small className="mt-1 block text-xs font-medium text-red-500">⚠️ Limit Aşıldı!</small>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}