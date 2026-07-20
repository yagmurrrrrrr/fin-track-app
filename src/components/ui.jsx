// Küçük, tekrar kullanılabilir arayüz parçaları.
// shadcn/ui'nin ruhuna uygun: sade, tutarlı, erişilebilir, Tailwind ile stillenmiş.

import { useEffect, useRef } from 'react';

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary: 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-900 dark:hover:bg-cyan-300',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700',
  // Dolu kırmızı "Çıkış Yap" butonu, en az basılan aksiyon olmasına rağmen görsel ağırlıkta
  // ana içerikle yarışıyordu. Rengi koruyup dolgusunu kaldırdık — hâlâ net bir tehlike/çıkış
  // sinyali veriyor ama artık sayfanın odağını çalmıyor.
  dangerOutline: 'border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
};

// Varlık kartlarındaki (Dolar/Euro/Altın) emoji ikonlar (💵💶🟡) uygulamanın geri kalanındaki
// düz/flat tasarım diliyle uyuşmuyordu ("clipart" hissi). Yerine, kartın kendi rengiyle eşleşen
// dolgu bir rozet içinde sade bir sembol/kısaltma kullanıyoruz — Revolut/Wise tarzı flat ikon kalıbı.
export function AssetIcon({ symbol, bgClass, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${bgClass} ${className}`}
    >
      {symbol}
    </span>
  );
}

export function Button({ variant = 'primary', className = '', children, loading = false, disabled = false, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      <span className={loading ? 'opacity-80' : ''}>{children}</span>
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500 ${className}`}
        {...props}
      />
    </label>
  );
}

export function TextArea({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
      <textarea
        className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500 ${className}`}
        {...props}
      />
    </label>
  );
}

// Native input[type=number] ok butonları uygulamanın tasarım diliyle uyuşmuyordu (tarayıcı varsayılanı,
// stillenemiyor). Bunun yerine kendi +/- butonlarımızı çiziyoruz, native spinner'ı .num-input-clean ile gizliyoruz.
export function NumberStepper({ value, onChange, min, max, step = 1, compact = false, className = '', ariaLabel, decreaseLabel = 'Azalt', increaseLabel = 'Artır', ...props }) {
  const numValue = parseFloat(value);
  const safeValue = Number.isFinite(numValue) ? numValue : 0;

  const clamp = (n) => {
    let v = n;
    if (typeof min === 'number') v = Math.max(min, v);
    if (typeof max === 'number') v = Math.min(max, v);
    return v;
  };

  const btnSize = compact ? 'h-8 w-8 text-sm' : 'h-11 w-11 text-base';
  // compact varyant 32px'de kalıyor (dar alanlarda görsel yoğunluk için) ama WCAG 2.5.5'in
  // 44px dokunma hedefi şartını karşılamak için görünmez bir "before" alanıyla hit-area'yı genişletiyoruz.
  const hitAreaExpand = compact ? "before:absolute before:-inset-1.5 before:content-['']" : '';
  const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900';

  return (
    <div className={`inline-flex w-full items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(String(clamp(safeValue - step)))}
        aria-label={ariaLabel ? `${ariaLabel} — ${decreaseLabel}` : decreaseLabel}
        className={`relative flex flex-shrink-0 items-center justify-center font-semibold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 ${btnSize} ${hitAreaExpand} ${focusRing}`}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={`num-input-clean w-full min-w-0 border-x border-slate-300 bg-transparent px-1 text-center text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-cyan-500 dark:border-slate-600 dark:text-slate-50 ${compact ? 'py-1' : 'py-2'}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => onChange(String(clamp(safeValue + step)))}
        aria-label={ariaLabel ? `${ariaLabel} — ${increaseLabel}` : increaseLabel}
        className={`relative flex flex-shrink-0 items-center justify-center font-semibold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 ${btnSize} ${hitAreaExpand} ${focusRing}`}
      >
        +
      </button>
    </div>
  );
}

// Finansal kartlarda "geçen aya göre arttı mı azaldı mı" bilgisini gösteren küçük rozet.
// direction: 'up' | 'down' | 'flat' — renk semantiği gelir/gider ile aynı (yeşil=iyi, kırmızı=kötü, gri=nötr).
export function TrendBadge({ direction = 'flat', label, caption, className = '', captionClassName = 'text-slate-400 dark:text-slate-500', directionWord }) {
  const TONE = {
    up: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    down: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    flat: 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
  };
  const ARROW = { up: '▲', down: '▼', flat: '→' };
  // Yön bilgisi sadece renk + aria-hidden okla veriliyordu — ekran okuyucu kullanıcıları
  // "arttı mı azaldı mı" bilgisini hiç duymuyordu. Tüm rozeti tek bir açıklayıcı aria-label
  // altında topluyoruz, içindeki görünür parçaları aria-hidden yapıyoruz (çift okuma olmasın).
  const fullLabel = [directionWord, label, caption].filter(Boolean).join(', ');

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="img" aria-label={fullLabel || undefined}>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${TONE[direction]}`} aria-hidden="true">
        <span>{ARROW[direction]}</span>
        {label}
      </span>
      {/* caption'ın rengi çağıran taraftan özelleştirilebilir — kart arka planı koyu gradient olduğunda
          varsayılan gri metin okunmaz hale geliyordu (ölçüm: slate-500 / cyan-700 = 1.13:1). */}
      {caption && <span className={`text-xs ${captionClassName}`} aria-hidden="true">{caption}</span>}
    </span>
  );
}

// İçeriğin şeklini taklit eden yüklenme placeholder'ı. Tek bir tam-sayfa spinner yerine
// kullanıcı "dashboard'un neye benzeyeceğini" görür — algılanan performans için etkili,
// yaygın bir SaaS kalıbı (Linear/Notion/GitHub). Sade bir CSS animasyonu, yeni bağımlılık yok.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`} aria-hidden="true" />;
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
      <select
        className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, children, className = '', label }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const onCloseRef = useRef(onClose);

  // onClose her render'da yeni bir referans olabilir (ör. App.jsx'te inline arrow fn).
  // Bunu ref'te tutuyoruz ki aşağıdaki effect SADECE "open" değiştiğinde çalışsın,
  // yoksa formData her değiştiğinde (her tuş vuruşunda) effect yeniden tetiklenip
  // odağı zorla ilk input'a (Açıklama) geri atıyordu.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Klavye erişimi: Escape ile kapat, Tab odağı modal içinde döngüye al, açılınca odağı içeri taşı, kapanınca geri ver.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const focusables = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusables && focusables.length > 0) {
      focusables[0].focus();
    } else {
      dialogRef.current?.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}