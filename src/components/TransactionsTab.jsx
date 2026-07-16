import { Card } from './ui.jsx';

function TransactionTable({ t, rows, onDelete }) {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">{t.noData}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
            <th className="py-2 font-medium">{t.desc}</th>
            <th className="py-2 font-medium">{t.amt}</th>
            <th className="py-2 font-medium">{t.date}</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(tr => {
            const positive = tr.amount > 0;
            return (
              <tr
                key={tr.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <td className="py-3 pr-2">
                  <div className="text-slate-800 dark:text-slate-100">{tr.desc}</div>
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {t[tr.cat] || tr.cat}
                  </span>
                </td>
                <td className={`py-3 pr-2 font-semibold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {positive ? '+' : ''}{tr.amount}₺
                </td>
                <td className="py-3 pr-2 text-xs text-slate-400 dark:text-slate-500">{tr.date}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onDelete(tr.id, tr.amount)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CountBadge({ n, colorClass }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>{n}</span>
  );
}

export default function TransactionsTab({ t, transactions, deleteTransaction }) {
  // Döviz/altın alım-satımları (cat === 'yatirim') artık gelir/gider listelerini kalabalıklaştırmıyor,
  // kendi ayrı grubunda gösteriliyor.
  const trades = transactions.filter(tr => tr.cat === 'yatirim');
  const income = transactions.filter(tr => tr.amount > 0 && tr.cat !== 'yatirim');
  const expense = transactions.filter(tr => tr.amount < 0 && tr.cat !== 'yatirim');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-emerald-500">
            💚 {t.historyIn}
            <CountBadge n={income.length} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
          </h3>
          <TransactionTable t={t} rows={income} onDelete={deleteTransaction} />
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-red-500">
            💸 {t.historyOut}
            <CountBadge n={expense.length} colorClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" />
          </h3>
          <TransactionTable t={t} rows={expense} onDelete={deleteTransaction} />
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-cyan-600 dark:text-cyan-400">
          💱 {t.tradeHistory}
          <CountBadge n={trades.length} colorClass="bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" />
        </h3>
        <TransactionTable t={t} rows={trades} onDelete={deleteTransaction} />
      </Card>
    </div>
  );
}