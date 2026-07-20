import { useState } from 'react';
import { Button, NumberStepper } from './ui.jsx';

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
  const [limitsOpen, setLimitsOpen] = useState(false);

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
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
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

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setLimitsOpen(o => !o)}
            aria-expanded={limitsOpen}
            className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">{t.limits}</span>
            <span
              aria-hidden="true"
              className={`text-slate-400 transition-transform duration-200 dark:text-slate-500 ${limitsOpen ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          {limitsOpen && (
            <div className="max-h-64 space-y-3 overflow-y-auto px-4 pb-5 pt-1">
              {Object.keys(limits).map(cat => (
                <div key={cat} className="flex flex-col gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t[cat]?.toUpperCase() || cat.toUpperCase()}</span>
                  <NumberStepper
                    compact
                    value={limits[cat]}
                    min={0}
                    step={100}
                    onChange={val => setLimits({ ...limits, [cat]: val })}
                    onBlur={() => saveLimits(limits)}
                    ariaLabel={`${t[cat] || cat} ${t.limitAmountLabel}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}>
              🌐 {lang.toUpperCase()}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '🌙' : '☀️'}
            </Button>
          </div>
          {/* Dolu kırmızı buton en az basılan aksiyonun ekranda en fazla görsel ağırlığı taşımasına
              yol açıyordu — outline'a çevirdik, hâlâ net bir "dikkatli ol" sinyali veriyor. */}
          <Button variant="dangerOutline" className="w-full" onClick={onLogout}>
            🚪 {t.logout}
          </Button>
        </div>
      </aside>
    </>
  );
}