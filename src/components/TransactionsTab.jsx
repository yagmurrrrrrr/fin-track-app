import { useState, useMemo, useRef, useEffect, memo } from 'react';
import { Card, Input, Select } from './ui.jsx';

// "dd.mm.yyyy" -> "yyyy-mm-dd" — native <input type="date"> ile string olarak karşılaştırılabilsin diye.
function toISODate(dateStr) {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return '';
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// Liste büyüdükçe (30-40+ satır) her filtre/sıralama değişiminde tüm satırların yeniden render
// olmasını önlemek için satır bileşenlerini memo'luyoruz — sadece kendi tr/t/onDelete'i değişen satır render olur.
const TableRow = memo(function TableRow({ t, tr, onDelete }) {
  const positive = tr.amount > 0;
  return (
    <tr className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <td className="py-3 pr-2">
        <div className="text-slate-800 dark:text-slate-100">{tr.desc}</div>
        <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {t[tr.cat] || tr.cat}
        </span>
      </td>
      <td className={`py-3 pr-2 font-semibold ${positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {positive ? '+' : ''}{tr.amount}₺
      </td>
      <td className="py-3 pr-2 text-xs text-slate-400 dark:text-slate-500">{tr.date}</td>
      <td className="py-3 text-right">
        <button
          onClick={() => onDelete(tr.id, tr.amount)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400"
          aria-label="Delete"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
});

// Mobilde tablo yerine kullanılan yığılmış kart satırı — küçük ekranda yatay kaydırma yerine
// dikey, doğal okuma akışı sağlıyor (Revolut/Wise tarzı finansal liste kalıbı).
const MobileRow = memo(function MobileRow({ t, tr, onDelete }) {
  const positive = tr.amount > 0;
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-slate-800 dark:text-slate-100">{tr.desc}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {t[tr.cat] || tr.cat}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{tr.date}</span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-0.5">
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {positive ? '+' : ''}{tr.amount}₺
        </span>
        <button
          onClick={() => onDelete(tr.id, tr.amount)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400"
          aria-label="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
});

function TransactionTable({ t, rows, onDelete, emptyIcon, emptyTitle, emptyHint, isFiltered }) {
  if (rows.length === 0) {
    // Filtre aktifken "henüz gelir yok" gibi tip-özel boş durumu yanıltıcı olur
    // (kullanıcının verisi var ama filtre eşleşmiyor) — bu yüzden ayrı bir mesaj kullanıyoruz.
    if (isFiltered) {
      return (
        <div className="flex flex-col items-center gap-1 py-8 text-center">
          <span className="text-3xl" aria-hidden="true">🔍</span>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{t.noFilterResultsTitle}</p>
          <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">{t.noFilterResultsHint}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-1 py-8 text-center">
        <span className="text-3xl" aria-hidden="true">{emptyIcon}</span>
        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{emptyTitle}</p>
        <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">{emptyHint}</p>
      </div>
    );
  }
  return (
    <>
      {/* Masaüstü/tablet (md+): klasik tablo */}
      <div className="hidden overflow-x-auto md:block">
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
            {rows.map(tr => <TableRow key={tr.id} t={t} tr={tr} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>

      {/* Mobil (< md): yığılmış kart satırları */}
      <div className="md:hidden">
        {rows.map(tr => <MobileRow key={tr.id} t={t} tr={tr} onDelete={onDelete} />)}
      </div>
    </>
  );
}

function CountBadge({ n, colorClass }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>{n}</span>
  );
}

export default function TransactionsTab({ t, transactions, deleteTransaction }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const searchInputRef = useRef(null);

  // "/" tuşuyla arama kutusuna odaklan (GitHub/Linear alışkanlığı) — başka bir input'a
  // yazarken tetiklenmesin diye aktif elemanın input/textarea olmadığını kontrol ediyoruz.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const availableCategories = useMemo(() => {
    const seen = new Map();
    transactions.forEach(tr => {
      if (!seen.has(tr.cat)) seen.set(tr.cat, t[tr.cat] || tr.cat);
    });
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [transactions, t]);

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || dateFrom !== '' || dateTo !== '';

  const filteredAndSorted = useMemo(() => {
    const query = search.trim().toLowerCase();

    let rows = transactions.filter(tr => {
      if (query) {
        const label = (t[tr.cat] || tr.cat).toLowerCase();
        if (!tr.desc.toLowerCase().includes(query) && !label.includes(query)) return false;
      }
      if (category !== 'all' && tr.cat !== category) return false;
      if (dateFrom || dateTo) {
        const iso = toISODate(tr.date);
        if (dateFrom && iso < dateFrom) return false;
        if (dateTo && iso > dateTo) return false;
      }
      return true;
    });

    if (sortBy === 'oldest') {
      rows = [...rows].reverse();
    } else if (sortBy === 'amount_desc') {
      rows = [...rows].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    } else if (sortBy === 'amount_asc') {
      rows = [...rows].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    }
    // 'newest' -> transactions zaten eklenme sırasına göre en yeni önde geliyor (App.jsx'te prepend ediliyor), dokunmuyoruz.

    return rows;
  }, [transactions, search, category, dateFrom, dateTo, sortBy, t]);

  // Döviz/altın alım-satımları (cat === 'yatirim') artık gelir/gider listelerini kalabalıklaştırmıyor,
  // kendi ayrı grubunda gösteriliyor.
  const trades = filteredAndSorted.filter(tr => tr.cat === 'yatirim');
  const income = filteredAndSorted.filter(tr => tr.amount > 0 && tr.cat !== 'yatirim');
  const expense = filteredAndSorted.filter(tr => tr.amount < 0 && tr.cat !== 'yatirim');

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('newest');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          <div className="flex-1 md:min-w-[220px]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{t.searchLabel}</span>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`${t.searchPlaceholder} (/)`}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500"
              />
            </label>
          </div>

          <div className="md:w-48">
            <Select label={t.filterCategory} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">{t.allCategories}</option>
              {availableCategories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </div>

          <div className="md:w-40">
            <Input type="date" label={t.dateFrom} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>

          <div className="md:w-40">
            <Input type="date" label={t.dateTo} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>

          <div className="md:w-48">
            <Select label={t.sortBy} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">{t.sortNewest}</option>
              <option value="oldest">{t.sortOldest}</option>
              <option value="amount_desc">{t.sortAmountDesc}</option>
              <option value="amount_asc">{t.sortAmountAsc}</option>
            </Select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex h-11 flex-shrink-0 items-center justify-center rounded-lg px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              ✕ {t.clearFilters}
            </button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
            💚 {t.historyIn}
            <CountBadge n={income.length} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
          </h2>
          <TransactionTable
            t={t} rows={income} onDelete={deleteTransaction} isFiltered={hasActiveFilters}
            emptyIcon="💚" emptyTitle={t.emptyIncomeTitle} emptyHint={t.emptyIncomeHint}
          />
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-red-600 dark:text-red-400">
            💸 {t.historyOut}
            <CountBadge n={expense.length} colorClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" />
          </h2>
          <TransactionTable
            t={t} rows={expense} onDelete={deleteTransaction} isFiltered={hasActiveFilters}
            emptyIcon="💸" emptyTitle={t.emptyExpenseTitle} emptyHint={t.emptyExpenseHint}
          />
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-cyan-600 dark:text-cyan-400">
          💱 {t.tradeHistory}
          <CountBadge n={trades.length} colorClass="bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" />
        </h2>
        <TransactionTable
          t={t} rows={trades} onDelete={deleteTransaction} isFiltered={hasActiveFilters}
          emptyIcon="💱" emptyTitle={t.emptyTradeTitle} emptyHint={t.emptyTradeHint}
        />
      </Card>
    </div>
  );
}