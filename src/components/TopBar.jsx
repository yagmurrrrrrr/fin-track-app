export default function TopBar({ t, lang, rates, lastUpdated, user, currentUsername, motivation, onOpenMobileMenu }) {
  const tickerItems = [
    `USD: ${rates.dolar.toFixed(2)}₺`,
    `EUR: ${rates.euro.toFixed(2)}₺`,
    `GOLD (gr): ${rates.altin.toFixed(2)}₺`
  ];

  return (
    <div>
      <div className="flex h-11 items-center gap-4 overflow-hidden bg-slate-900 px-4 dark:bg-black">
        <button
          onClick={onOpenMobileMenu}
          className="flex-shrink-0 rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {tickerItems.map((item, i) => (
              <span key={i} className="mx-6 text-sm text-slate-200">
                <span className="font-bold text-emerald-400">● LIVE</span> {item}
              </span>
            ))}
          </div>
        </div>
        {lastUpdated && (
          <span className="hidden flex-shrink-0 text-xs text-slate-400 sm:block">
            🕒 {t.lastUpdate}: {lastUpdated.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US')}
          </span>
        )}
      </div>

      <div className="border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-800 sm:px-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
          {t.welcome}, {user.fullName || currentUsername} 👋
        </h2>
        <p className="mt-1.5 text-sm italic text-amber-600 dark:text-amber-400">"{motivation}"</p>
      </div>
    </div>
  );
}