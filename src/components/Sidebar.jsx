import { Button } from './ui.jsx';

const TABS = [
  { key: 'dashboard', icon: '📊' },
  { key: 'transactions', icon: '📝' },
  { key: 'analytics', icon: '📈' },
  { key: 'invest', icon: '💰' },
  { key: 'profile', icon: '👤' }
];

export default function Sidebar({
  t, activeTab, setActiveTab,
  limits, setLimits, saveLimits,
  lang, setLang, isDarkMode, setIsDarkMode,
  onLogout, mobileOpen, onCloseMobile
}) {
  return (
    <>
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden
          ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-shrink-0 flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900
          md:static md:z-auto md:translate-x-0 md:shadow-none md:border-r md:border-slate-200 md:dark:border-slate-700 md:transition-none
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide text-cyan-600 dark:text-cyan-400">{t.appName}</h2>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-500 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); onCloseMobile(); }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {t[tab.key]}
            </button>
          ))}
        </nav>

        <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">{t.limits}</p>
          <div className="space-y-2">
            {Object.keys(limits).map(cat => (
              <div key={cat} className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t[cat]?.toUpperCase() || cat.toUpperCase()}</span>
                <input
                  type="number"
                  value={limits[cat]}
                  onChange={e => setLimits({ ...limits, [cat]: e.target.value })}
                  onBlur={() => saveLimits(limits)}
                  className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right text-xs text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}>
              🌐 {lang.toUpperCase()}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '🌙' : '☀️'}
            </Button>
          </div>
          <Button variant="danger" className="w-full" onClick={onLogout}>
            🚪 {t.logout}
          </Button>
        </div>
      </aside>
    </>
  );
}