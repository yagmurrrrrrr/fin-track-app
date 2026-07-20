import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TEXTS, MOTIVATION, getDateStr, monthKeyFromDate, parseTrNumber
} from './lib/constants.js';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import TransactionsTab from './components/TransactionsTab.jsx';
import AnalyticsTab from './components/AnalyticsTab.jsx';
import InvestTab from './components/InvestTab.jsx';
import ProfileTab from './components/ProfileTab.jsx';
import { TransactionModal, PasswordModal } from './components/Modals.jsx';
import ToastContainer from './components/Toast.jsx';
import { Skeleton } from './components/ui.jsx';

const API_URL = 'http://localhost:4000/api';
const CONN_ERROR_TR = 'Sunucuya bağlanılamadı. Backend (server.cjs) çalışıyor mu?';
const CONN_ERROR_EN = 'Could not connect to the server. Is the backend (server.cjs) running?';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [lang, setLang] = useState('tr');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('gider');
  const [loginData, setLoginData] = useState({ user: 'yagmurrrrrr', pass: '123' });
  const [tradeAmounts, setTradeAmounts] = useState({ dolar: 1, euro: 1, altin: 1 });

  const [registerData, setRegisterData] = useState({ username: '', password: '', confirm: '', fullName: '', securityAnswer: '' });
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotData, setForgotData] = useState({ username: '', securityAnswer: '', newPassword: '', confirm: '' });
  const [currentUsername, setCurrentUsername] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // --- TOAST BİLDİRİMLERİ (alert() yerine) ---
  const [toasts, setToasts] = useState([]);
  const showToast = (message, variant = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, variant }]);
  };
  const dismissToast = (id) => setToasts(prev => prev.filter(tst => tst.id !== id));

  // --- YÜKLENİYOR DURUMLARI (buton spinner'ları + çift gönderim engeli) ---
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingTx, setIsSavingTx] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- SES EFEKTİ SİSTEMİ ---
  const trinkSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'));

  const playTrink = () => {
    trinkSound.current.currentTime = 0;
    trinkSound.current.play().catch(e => console.log("Ses çalınamadı:", e));
  };

  const [user, setUser] = useState({
    fullName: '', phone: '', address: '', email: '', job: '', birthDate: '', gender: 'Kadın'
  });
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({ bakiye: 0, dolar: 0, euro: 0, altin: 0 });
  const [limits, setLimits] = useState({
    gida: 5000, kira: 15000, ulasim: 2000, teknoloji: 10000, eglence: 3000, fatura: 4000
  });

  // --- GÜNCEL KURLAR (dolar/euro TCMB/ECB tabanlı, altın gram bazlı) ---
  const [rates, setRates] = useState({ dolar: 43.15, euro: 50.45, altin: 6150.20 });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [formData, setFormData] = useState({ desc: '', amt: '', cat: 'gida' });

  // --- MOTİVASYON SÖZÜ: dış kaynaktan (type.fit, 1600+ söz) rastgele seçilir ---
  const [quotePool, setQuotePool] = useState([]);
  const [motivationText, setMotivationText] = useState('');

  // Tam söz listesini ara sıra tazele (60 sn'de bir) — sunucuyu her 5 sn'de yormamak için
  useEffect(() => {
    let cancelled = false;
    const fetchPool = async () => {
      try {
        const res = await fetch('https://type.fit/api/quotes');
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setQuotePool(data);
        }
      } catch (e) {
        console.log('Söz listesi alınamadı:', e);
      }
    };
    fetchPool();
    const interval = setInterval(fetchPool, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Her 5 sn'de, 1600+ sözlük listeden tamamen rastgele bir tanesini seç
  useEffect(() => {
    let cancelled = false;

    const pickRandomQuote = async () => {
      if (quotePool.length === 0) {
        const fallback = MOTIVATION[lang];
        setMotivationText(fallback[Math.floor(Math.random() * fallback.length)]);
        return;
      }

      const random = quotePool[Math.floor(Math.random() * quotePool.length)];
      const author = random.author || (lang === 'tr' ? 'Bilinmiyor' : 'Unknown');

      if (lang === 'en') {
        setMotivationText(`${random.text} — ${author}`);
        return;
      }

      try {
        const trRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(random.text)}&langpair=en|tr`);
        const trData = await trRes.json();
        const translated = trData?.responseData?.translatedText;
        if (!cancelled) {
          setMotivationText(translated ? `${translated} — ${author}` : `${random.text} — ${author}`);
        }
      } catch (e) {
        if (!cancelled) setMotivationText(`${random.text} — ${author}`);
      }
    };

    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [quotePool, lang]);

  // --- CANLI KUR ÇEKME ---
  useEffect(() => {
    let cancelled = false;

    const fetchRates = async () => {
      let latestUsdTry = null;

      try {
        const [usdRes, eurRes] = await Promise.all([
          fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=TRY'),
          fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=TRY')
        ]);
        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        const usdTry = usdData?.rates?.TRY;
        const eurTry = eurData?.rates?.TRY;
        if (usdTry) latestUsdTry = usdTry;
        if (!cancelled && (usdTry || eurTry)) {
          setRates(prev => ({
            ...prev,
            dolar: usdTry ?? prev.dolar,
            euro: eurTry ?? prev.euro
          }));
        }
      } catch (e) {
        console.log('Döviz kuru alınamadı, önceki değer korunuyor:', e);
      }

      // Gram altın -> TRY: ons altın fiyatını (USD) çekip gram'a ve TL'ye çeviriyoruz
      try {
        const goldRes = await fetch('https://api.gold-api.com/price/XAU');
        const goldData = await goldRes.json();
        const ouncePriceUsd = goldData?.price;
        const usdTryForGold = latestUsdTry ?? rates.dolar;
        if (!cancelled && ouncePriceUsd && usdTryForGold) {
          const gramPriceTry = (ouncePriceUsd / 31.1034768) * usdTryForGold;
          setRates(prev => ({ ...prev, altin: gramPriceTry }));
        }
      } catch (e) {
        console.log('Altın fiyatı alınamadı, önceki değer korunuyor:', e);
      }

      if (!cancelled) setLastUpdated(new Date());
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // --- GİRİŞ SONRASI: kullanıcının profil/cüzdan/limit/işlem verilerini API'den çek ---
  useEffect(() => {
    if (!isLoggedIn || !currentUsername) return;

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [userRes, walletRes, limitsRes, txRes] = await Promise.all([
          fetch(`${API_URL}/user/${currentUsername}`),
          fetch(`${API_URL}/wallet/${currentUsername}`),
          fetch(`${API_URL}/limits/${currentUsername}`),
          fetch(`${API_URL}/transactions/${currentUsername}`)
        ]);

        const userData = await userRes.json();
        const walletData = await walletRes.json();
        const limitsData = await limitsRes.json();
        const txData = await txRes.json();

        if (userData.user) setUser(userData.user);
        if (walletData.wallet) {
          setWallet({
            bakiye: Number(walletData.wallet.bakiye),
            dolar: Number(walletData.wallet.dolar),
            euro: Number(walletData.wallet.euro),
            altin: Number(walletData.wallet.altin)
          });
        }
        if (limitsData.limits) {
          setLimits({
            gida: Number(limitsData.limits.gida),
            kira: Number(limitsData.limits.kira),
            ulasim: Number(limitsData.limits.ulasim),
            teknoloji: Number(limitsData.limits.teknoloji),
            eglence: Number(limitsData.limits.eglence),
            fatura: Number(limitsData.limits.fatura)
          });
        }
        if (txData.transactions) {
          setTransactions(txData.transactions.map(tr => ({ ...tr, amount: Number(tr.amount) })));
        }
      } catch (e) {
        console.log('Kullanıcı verisi sunucudan alınamadı:', e);
        showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [isLoggedIn, currentUsername]);

  // --- Cüzdan / limit değişikliklerini sunucuya kaydet ---
  useEffect(() => {
    if (!currentUsername) return;
    const persist = async () => {
      try {
        await fetch(`${API_URL}/wallet/${currentUsername}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wallet)
        });
        await fetch(`${API_URL}/limits/${currentUsername}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(limits)
        });
      } catch (e) {
        console.log('Cüzdan/limit sunucuya kaydedilemedi:', e);
      }
    };
    persist();
  }, [wallet, limits, currentUsername]);

  // --- Profil değişikliklerini sunucuya kaydet ---
  useEffect(() => {
    if (!currentUsername) return;
    fetch(`${API_URL}/user/${currentUsername}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).catch(e => console.log('Profil sunucuya kaydedilemedi:', e));
  }, [user, currentUsername]);

  const t = TEXTS[lang];

  // Dil değiştiğinde <html lang> ve sekme başlığı da güncellensin — WCAG 3.1.1 (Language of Page)
  // uyarınca, sayfa içeriği İngilizce'ye geçtiğinde lang="tr" olarak kalması ekran okuyucuların
  // yanlış telaffuz/dil motoru kullanmasına yol açıyordu.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.appName;
  }, [lang, t.appName]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.user.trim(), password: loginData.pass.trim() })
      });
      if (!res.ok) {
        showToast(lang === 'tr' ? "Giriş başarısız!" : "Login failed!", 'error');
        return;
      }
      const data = await res.json();
      setCurrentUsername(data.user.username);
      setIsLoggedIn(true);
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (isRegistering) return;
    const { username, password, confirm, fullName, securityAnswer } = registerData;
    if (!username.trim() || !password || !confirm || !fullName.trim() || !securityAnswer.trim()) {
      showToast(t.fillAllFields, 'warning'); return;
    }
    if (password !== confirm) { showToast(t.errPasswordMismatch, 'warning'); return; }
    if (password.length < 3) { showToast(t.errPasswordTooShort, 'warning'); return; }

    setIsRegistering(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(), password, fullName: fullName.trim(), securityAnswer: securityAnswer.trim()
        })
      });
      if (res.status === 409) { showToast(t.errUsernameTaken, 'error'); return; }
      if (!res.ok) throw new Error('register failed');

      showToast(t.registerSuccess, 'success');
      setLoginData({ user: username.trim(), pass: '' });
      setRegisterData({ username: '', password: '', confirm: '', fullName: '', securityAnswer: '' });
      setAuthView('login');
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleForgotVerify = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_URL}/forgot/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: forgotData.username.trim(), securityAnswer: forgotData.securityAnswer.trim()
        })
      });
      if (res.status === 404) { showToast(t.errUserNotFound, 'error'); return; }
      if (res.status === 401) { showToast(t.errWrongAnswer, 'error'); return; }
      if (!res.ok) throw new Error('verify failed');
      setForgotStep(2);
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleForgotReset = async () => {
    if (isResetting) return;
    const { username, newPassword, confirm } = forgotData;
    if (!newPassword || newPassword !== confirm) { showToast(t.errPasswordMismatch, 'warning'); return; }
    if (newPassword.length < 3) { showToast(t.errPasswordTooShort, 'warning'); return; }

    setIsResetting(true);
    try {
      const res = await fetch(`${API_URL}/forgot/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), newPassword })
      });
      if (!res.ok) throw new Error('reset failed');

      showToast(t.passwordResetSuccess, 'success');
      setLoginData({ user: username.trim(), pass: '' });
      setForgotData({ username: '', securityAnswer: '', newPassword: '', confirm: '' });
      setForgotStep(1);
      setAuthView('login');
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) return;
    const { current, next, confirm } = passwordForm;
    if (!current || !next || !confirm) { showToast(t.fillAllFields, 'warning'); return; }
    if (next !== confirm) { showToast(t.errPasswordMismatch, 'warning'); return; }
    if (next.length < 3) { showToast(t.errPasswordTooShort, 'warning'); return; }

    setIsChangingPassword(true);
    try {
      const res = await fetch(`${API_URL}/user/${currentUsername}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next })
      });
      if (res.status === 401) { showToast(t.errWrongCurrentPassword, 'error'); return; }
      if (!res.ok) throw new Error('change failed');

      showToast(t.passwordUpdated, 'success');
      setPasswordForm({ current: '', next: '', confirm: '' });
      setShowPasswordModal(false);
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSave = async () => {
    if (isSavingTx) return;
    const val = parseFloat(formData.amt);
    if (!val) return;
    const final = modalType === 'gelir' ? val : -val;
    const dateStr = getDateStr();
    const newTx = { desc: formData.desc, amount: final, cat: formData.cat, date: dateStr };

    setIsSavingTx(true);
    try {
      const res = await fetch(`${API_URL}/transactions/${currentUsername}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
      if (!res.ok) throw new Error('save failed');
      const data = await res.json();
      setTransactions([{ id: data.id, ...newTx }, ...transactions]);
      setWallet({ ...wallet, bakiye: wallet.bakiye + final });
      playTrink();
      setShowModal(false);
      showToast(t.txSavedSuccess, 'success');
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsSavingTx(false);
    }
  };

  const deleteTransaction = async (id, amount) => {
    setTransactions(transactions.filter(tr => tr.id !== id));
    setWallet({ ...wallet, bakiye: wallet.bakiye - amount });
    try {
      await fetch(`${API_URL}/transactions/${currentUsername}/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Silme sunucuya yansıtılamadı:', e);
    }
  };

  const handleTrade = async (asset, type) => {
    if (isTrading) return;
    const amount = parseFloat(tradeAmounts[asset]);
    if (!amount || amount <= 0) return;
    const totalCost = rates[asset] * amount;
    const dateStr = getDateStr();

    if (type === 'al' && wallet.bakiye < totalCost) {
      showToast(lang === 'tr' ? "Yetersiz Bakiye!" : "Insufficient Balance!", 'warning');
      return;
    }
    if (type === 'sat' && wallet[asset] < amount) {
      showToast(lang === 'tr' ? "Yetersiz Varlık!" : "Insufficient Assets!", 'warning');
      return;
    }

    const desc = type === 'al' ? `${asset.toUpperCase()} Alım` : `${asset.toUpperCase()} Satış`;
    const txAmount = type === 'al' ? -totalCost : totalCost;
    const newTx = { desc, amount: txAmount, cat: 'yatirim', date: dateStr };

    setIsTrading(true);
    try {
      const res = await fetch(`${API_URL}/transactions/${currentUsername}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
      if (!res.ok) throw new Error('trade failed');
      const data = await res.json();

      if (type === 'al') {
        setWallet({ ...wallet, bakiye: wallet.bakiye - totalCost, [asset]: wallet[asset] + amount });
      } else {
        setWallet({ ...wallet, bakiye: wallet.bakiye + totalCost, [asset]: wallet[asset] - amount });
      }
      setTransactions([{ id: data.id, ...newTx }, ...transactions]);
      playTrink();
      showToast(t.tradeSuccess, 'success');
    } catch (e) {
      showToast(lang === 'tr' ? CONN_ERROR_TR : CONN_ERROR_EN, 'error');
    } finally {
      setIsTrading(false);
    }
  };

  const handleProfileSave = () => {
    showToast(t.updated, 'success');
  };

  const categoryBreakdown = useMemo(() => {
    const totals = {};
    transactions.filter(tr => tr.amount < 0).forEach(tr => {
      totals[tr.cat] = (totals[tr.cat] || 0) + Math.abs(tr.amount);
    });
    return Object.keys(totals)
      .map(cat => ({ name: t[cat] || cat, value: Math.round(totals[cat] * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, lang]);

  const monthlyTrend = useMemo(() => {
    const byMonth = {};
    transactions.forEach(tr => {
      const key = monthKeyFromDate(tr.date);
      if (!key) return;
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
      if (tr.amount > 0) byMonth[key].income += tr.amount;
      else byMonth[key].expense += Math.abs(tr.amount);
    });
    return Object.keys(byMonth).sort().slice(-6).map(key => {
      const [y, m] = key.split('-');
      return {
        month: `${m}/${y.slice(2)}`,
        [t.incomeLbl]: Math.round(byMonth[key].income),
        [t.expenseLbl]: Math.round(byMonth[key].expense)
      };
    });
  }, [transactions, lang]);

  const assetAllocation = useMemo(() => {
    const rows = [
      { name: t.totalBalance, value: wallet.bakiye },
      { name: 'USD', value: wallet.dolar * rates.dolar },
      { name: 'EUR', value: wallet.euro * rates.euro },
      { name: 'GOLD', value: wallet.altin * rates.altin }
    ];
    return rows.filter(r => r.value > 0).map(r => ({ ...r, value: Math.round(r.value * 100) / 100 }));
  }, [wallet, rates, lang]);

  const netWorth = assetAllocation.reduce((sum, r) => sum + r.value, 0);

  // Bu ayın net değişimini (gelir - gider) geçen ayla kıyaslar; Dashboard'daki TrendBadge için.
  // Yeterli veri yoksa (geçen ay hiç işlem yoksa) null döner ve rozet hiç gösterilmez.
  const balanceTrend = useMemo(() => {
    const now = new Date();
    const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevRef.getFullYear()}-${String(prevRef.getMonth() + 1).padStart(2, '0')}`;

    let thisNet = 0, prevNet = 0, thisHas = false, prevHas = false;
    transactions.forEach(tr => {
      const key = monthKeyFromDate(tr.date);
      if (key === thisKey) { thisNet += tr.amount; thisHas = true; }
      else if (key === prevKey) { prevNet += tr.amount; prevHas = true; }
    });

    if (!thisHas || !prevHas || prevNet === 0) return null;

    const change = ((thisNet - prevNet) / Math.abs(prevNet)) * 100;
    const direction = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'flat';
    return { direction, percent: Math.round(Math.abs(change)) };
  }, [transactions]);

  if (!isLoggedIn) {
    return (
      <>
        <AuthScreen
          t={t}
          isDarkMode={isDarkMode}
          authView={authView}
          setAuthView={setAuthView}
          loginData={loginData}
          setLoginData={setLoginData}
          handleLogin={handleLogin}
          loginLoading={isLoggingIn}
          registerData={registerData}
          setRegisterData={setRegisterData}
          handleRegister={handleRegister}
          registerLoading={isRegistering}
          forgotStep={forgotStep}
          setForgotStep={setForgotStep}
          forgotData={forgotData}
          setForgotData={setForgotData}
          handleForgotVerify={handleForgotVerify}
          verifyLoading={isVerifying}
          handleForgotReset={handleForgotReset}
          resetLoading={isResetting}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (isLoadingData) {
    // Tek bir dönen spinner yerine, Dashboard'un gerçek şeklini taklit eden bir iskelet gösteriyoruz —
    // kullanıcı "bir şeyler yükleniyor" değil "dashboard'um birazdan burada olacak" hissini alıyor,
    // algılanan performans artıyor (Linear/Notion/GitHub'ta yaygın kalıp). aria-busy ile ekran okuyucuya
    // da bu alanın henüz hazır olmadığı bildiriliyor.
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div
          className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950"
          role="status"
          aria-busy="true"
          aria-label={lang === 'tr' ? 'Yükleniyor' : 'Loading'}
        >
          <div className="hidden w-72 flex-shrink-0 border-r border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 md:block">
            <Skeleton className="mb-8 h-6 w-32" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Skeleton className="h-11 w-full rounded-none" />
            <div className="border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-800 sm:px-10">
              <Skeleton className="h-6 w-56" />
            </div>
            <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
              <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-72 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <Sidebar
          t={t}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          limits={limits}
          setLimits={setLimits}
          saveLimits={() => {}}
          lang={lang}
          setLang={setLang}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onLogout={() => { setIsLoggedIn(false); setCurrentUsername(null); setAuthView('login'); }}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar
            t={t}
            lang={lang}
            rates={rates}
            lastUpdated={lastUpdated}
            user={user}
            currentUsername={currentUsername}
            motivation={motivationText}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           <div className="mx-auto w-full max-w-screen-2xl">
            {activeTab === 'dashboard' && (
              <DashboardTab
                t={t}
                wallet={wallet}
                limits={limits}
                transactions={transactions}
                onOpenIncome={() => { setModalType('gelir'); setFormData({ ...formData, cat: 'maas' }); setShowModal(true); }}
                onOpenExpense={() => { setModalType('gider'); setFormData({ ...formData, cat: 'gida' }); setShowModal(true); }}
                onViewAll={() => setActiveTab('transactions')}
                trend={balanceTrend}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsTab t={t} transactions={transactions} deleteTransaction={deleteTransaction} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab
                t={t}
                isDarkMode={isDarkMode}
                categoryBreakdown={categoryBreakdown}
                monthlyTrend={monthlyTrend}
                assetAllocation={assetAllocation}
                netWorth={netWorth}
              />
            )}

            {activeTab === 'invest' && (
              <InvestTab
                t={t}
                wallet={wallet}
                rates={rates}
                tradeAmounts={tradeAmounts}
                setTradeAmounts={setTradeAmounts}
                handleTrade={handleTrade}
                loading={isTrading}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                t={t}
                user={user}
                setUser={setUser}
                onSave={handleProfileSave}
                onOpenPasswordModal={() => setShowPasswordModal(true)}
              />
            )}
           </div>
          </div>
        </div>

        <TransactionModal
          t={t}
          open={showModal}
          modalType={modalType}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          loading={isSavingTx}
        />

        <PasswordModal
          t={t}
          open={showPasswordModal}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          onSave={handleChangePassword}
          onClose={() => setShowPasswordModal(false)}
          loading={isChangingPassword}
        />
      </div>
    </div>
  );
}

export default App;