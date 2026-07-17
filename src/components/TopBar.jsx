export default function TopBar({ t, lang, rates, lastUpdated, user, currentUsername, motivation, onOpenMobileMenu }) {
  const tickerItems = [
    `USD: ${rates.dolar.toFixed(2)}₺`,
    `EUR: ${rates.euro.toFixed(2)}₺`,
    `GOLD (gr): ${rates.altin.toFixed(2)}₺`
  ];

  const displayName = user.fullName || currentUsername;
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex h-11 items-center gap-4 overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {tickerItems.map((item, i) => (
              <span key={i} className="mx-6 text-sm text-slate-200">
                <span className="font-bold text-emerald-400">
                  <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
                  LIVE
                </span> {item}
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

      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-800 sm:px-10">
        <div className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-base font-bold text-white shadow-md shadow-cyan-500/30 sm:flex">
          {initial}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t.welcome}, {displayName} 👋
          </h2>
          <p className="mt-1.5 text-sm italic text-amber-700 dark:text-amber-400">"{motivation}"</p>
        </div>
      </div>
    </div>
  );
}