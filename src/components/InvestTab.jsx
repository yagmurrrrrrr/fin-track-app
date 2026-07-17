import { Card, Button, NumberStepper } from './ui.jsx';

const ASSET_ICONS = { dolar: '💵', euro: '💶', altin: '🟡' };
const ASSET_STYLES = {
  dolar: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  euro: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  altin: 'from-amber-500/15 to-amber-500/5 border-amber-500/20'
};

export default function InvestTab({ t, wallet, rates, tradeAmounts, setTradeAmounts, handleTrade, loading }) {
  const hasNoInvestments = wallet.dolar === 0 && wallet.euro === 0 && wallet.altin === 0;

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-700 to-cyan-900 text-white dark:from-cyan-700 dark:to-slate-900">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <h3 className="relative text-base font-semibold">💱 {t.tradeTitle}</h3>
        <p className="relative mt-1 text-sm uppercase tracking-wide text-cyan-50">
          {t.tradeBalance}: <b className="normal-case tracking-normal text-white">{wallet.bakiye.toLocaleString()} ₺</b>
        </p>
      </Card>

      {hasNoInvestments && (
        <p className="rounded-xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/5 dark:text-cyan-300">
          {t.emptyInvestHint}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['dolar', 'euro', 'altin'].map(asset => (
          <div
            key={asset}
            className={`rounded-2xl border bg-gradient-to-br p-5 text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${ASSET_STYLES[asset]}`}
          >
            <span className="text-2xl" aria-hidden="true">{ASSET_ICONS[asset]}</span>
            <h4 className="mt-1 font-semibold text-slate-900 dark:text-slate-50">{asset.toUpperCase()}</h4>
            <p className="my-1.5 text-lg font-bold text-cyan-700 dark:text-cyan-400">{rates[asset].toFixed(2)} ₺</p>
            <NumberStepper
              className="mb-3"
              value={tradeAmounts[asset]}
              min={0}
              step={1}
              onChange={val => setTradeAmounts({ ...tradeAmounts, [asset]: val })}
            />
            <div className="flex gap-2">
              <Button variant="success" className="flex-1 hover:-translate-y-0.5" loading={loading} onClick={() => handleTrade(asset, 'al')}>{t.buy}</Button>
              <Button variant="danger" className="flex-1 hover:-translate-y-0.5" loading={loading} onClick={() => handleTrade(asset, 'sat')}>{t.sell}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}