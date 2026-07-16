import { Card, Button } from './ui.jsx';

const ASSET_ICONS = { dolar: '💵', euro: '💶', altin: '🟡' };
const ASSET_STYLES = {
  dolar: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  euro: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  altin: 'from-amber-500/15 to-amber-500/5 border-amber-500/20'
};

export default function InvestTab({ t, wallet, rates, tradeAmounts, setTradeAmounts, handleTrade }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-600 to-cyan-800 text-white dark:from-cyan-500 dark:to-slate-900">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <h3 className="relative text-base font-semibold">💱 {t.tradeTitle}</h3>
        <p className="relative mt-1 text-sm text-cyan-100">
          {t.tradeBalance}: <b className="text-white">{wallet.bakiye.toLocaleString()} ₺</b>
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {['dolar', 'euro', 'altin'].map(asset => (
          <div
            key={asset}
            className={`rounded-2xl border bg-gradient-to-br p-5 text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${ASSET_STYLES[asset]}`}
          >
            <span className="text-2xl" aria-hidden="true">{ASSET_ICONS[asset]}</span>
            <h4 className="mt-1 font-semibold text-slate-900 dark:text-slate-50">{asset.toUpperCase()}</h4>
            <p className="my-1.5 text-lg font-bold text-cyan-700 dark:text-cyan-400">{rates[asset].toFixed(2)} ₺</p>
            <input
              type="number"
              value={tradeAmounts[asset]}
              onChange={e => setTradeAmounts({ ...tradeAmounts, [asset]: e.target.value })}
              className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm text-slate-900 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
            />
            <div className="flex gap-2">
              <Button variant="success" className="flex-1 hover:-translate-y-0.5" onClick={() => handleTrade(asset, 'al')}>{t.buy}</Button>
              <Button variant="danger" className="flex-1 hover:-translate-y-0.5" onClick={() => handleTrade(asset, 'sat')}>{t.sell}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}