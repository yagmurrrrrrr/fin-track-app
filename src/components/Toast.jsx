// Modern SaaS tarzı toast bildirim sistemi (Stripe/Linear/Notion ilhamlı).
// Mevcut Card/Modal görsel dilini kullanır: rounded-2xl, border + shadow, dark mode uyumlu.
// Ekstra kütüphane gerektirmez, sadece Tailwind'in yerleşik animate-spin/animate-pulse utility'leri kullanılır.

import { useEffect, useRef, useState } from 'react';

const DURATION = 4500;

const VARIANT_STYLES = {
  success: { icon: '✓', badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', bar: 'bg-emerald-500' },
  error: { icon: '✕', badge: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400', bar: 'bg-red-500' },
  warning: { icon: '⚠', badge: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400', bar: 'bg-amber-500' },
  info: { icon: 'ℹ', badge: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400', bar: 'bg-cyan-500' }
};

function ToastItem({ toast, onDismiss }) {
  // WCAG 2.2.1 (Timing Adjustable): sabit 4.5sn'de otomatik kapanan bir bildirim, özellikle
  // hata/uyarı mesajlarında, kullanıcı okumayı bitirmeden kaybolabiliyordu. Şimdi fare/klavye
  // odağı toast üzerindeyken sayaç duruyor, ayrılınca kalan süreden devam ediyor.
  const timerRef = useRef(null);
  const remainingRef = useRef(DURATION);
  const startedAtRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(toast.id), remainingRef.current);
  };

  useEffect(() => {
    start();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const handlePause = () => {
    if (paused) return;
    setPaused(true);
    clear();
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
  };

  const handleResume = () => {
    if (!paused) return;
    setPaused(false);
    start();
  };

  const style = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
  const isUrgent = toast.variant === 'error' || toast.variant === 'warning';

  return (
    <div
      role={isUrgent ? 'alert' : 'status'}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      className="toast-enter pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pr-9 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:w-96"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
          aria-hidden="true"
        >
          {style.icon}
        </span>
        <p className="flex-1 pt-0.5 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        aria-label="Kapat"
      >
        ✕
      </button>
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100 dark:bg-slate-700">
        <div className={`toast-progress h-full ${style.bar} ${paused ? '[animation-play-state:paused]' : ''}`} />
      </div>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col gap-2.5 sm:inset-x-auto sm:right-4">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .toast-enter { animation: toastIn 0.22s ease-out; }
        .toast-progress { animation: toastProgress ${DURATION}ms linear forwards; }
      `}</style>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}