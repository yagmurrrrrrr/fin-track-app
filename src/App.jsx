import React, { useState, useEffect, useRef } from 'react';

// --- GİRİŞ TAMİR EDİCİ ---
const repairLogin = () => {
  const defaultUser = {
    username: 'yagmurrrrrr', fullName: 'Yağmur Yılmaz', phone: '0555 555 55 55',
    address: 'Beşiktaş, İstanbul', email: 'yagmur@track.com', password: '123',
    job: 'Yazılım Geliştirici', birthDate: '1995-01-01', gender: 'Kadın'
  };
  localStorage.setItem('user_profile', JSON.stringify(defaultUser));
};

const MOTIVATION = [
  "Bugünün tasarrufu, yarının özgürlüğüdür.",
  "Paranı kontrol et, yoksa o seni kontrol eder.",
  "Zenginlik, kazandığından daha azını harcamaktır.",
  "Finansal özgürlük bir varış noktası değil, bir yolculuktur."
];

const TEXTS = {
  tr: {
    dashboard: "📊 Dashboard", transactions: "📝 İşlemler", invest: "💰 Döviz Al/Sat", profile: "👤 Profil",
    limits: "LİMİT AYARLARI", logout: "ÇIKIŞ YAP", welcome: "Hoş Geldiniz", totalBalance: "GÜNCEL TL BAKİYE",
    income: "+ Gelir Ekle", expense: "- Gider Ekle", limitStatus: "📊 Harcama & Limit Durumu", assets: "💎 Varlık Detayları",
    tradeTitle: "💎 Döviz ve Altın Ticareti", tradeBalance: "Bakiyeniz", buy: "Al", sell: "Sat",
    save: "KAYDET", cancel: "Vazgeç", historyIn: "📥 Gelir Geçmişi", historyOut: "📤 Gider Geçmişi",
    desc: "Açıklama", amt: "Tutar", cat: "Kategori", update: "BİLGİLERİ KAYDET", date: "Tarih",
    maas: "Maaş", yan_gelir: "Yan Gelir", prim: "Prim", faiz: "Faiz/Borsa", hediye: "Hediye",
    gida: "Gıda", kira: "Kira", ulasim: "Ulaşım", teknoloji: "Teknoloji", eglence: "Eğlence", 
    saglik: "Sağlık", fatura: "Faturalar", giyim: "Giyim", egitim: "Eğitim", diger: "Diğer"
  },
  en: {
    dashboard: "📊 Dashboard", transactions: "📝 Transactions", invest: "💰 Trade", profile: "👤 Profile",
    limits: "LIMIT SETTINGS", logout: "LOGOUT", welcome: "Welcome", totalBalance: "TOTAL TL BALANCE",
    income: "+ Add Income", expense: "- Add Expense", limitStatus: "📊 Spending & Limit Status", assets: "💎 Asset Details",
    tradeTitle: "💎 Currency & Gold Trade", tradeBalance: "Your Balance", buy: "Buy", sell: "Sell",
    save: "SAVE", cancel: "Cancel", historyIn: "📥 Income History", historyOut: "📤 Expense History",
    desc: "Description", amt: "Amount", cat: "Category", update: "SAVE CHANGES", date: "Date",
    maas: "Salary", yan_gelir: "Side Income", prim: "Bonus", faiz: "Interest/Stock", hediye: "Gift",
    gida: "Food", kira: "Rent", ulasim: "Transport", teknoloji: "Tech", eglence: "Fun",
    saglik: "Health", fatura: "Bills", giyim: "Clothing", egitim: "Education", diger: "Other"
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lang, setLang] = useState('tr');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('gider');
  const [loginData, setLoginData] = useState({ user: 'yagmurrrrrr', pass: '123' });
  const [tradeAmounts, setTradeAmounts] = useState({ dolar: 1, euro: 1, altin: 1 });
  
  // --- SES EFEKTİ SİSTEMİ ---
  const trinkSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'));

  const playTrink = () => {
    trinkSound.current.currentTime = 0;
    trinkSound.current.play().catch(e => console.log("Ses çalınamadı:", e));
  };

  useEffect(() => { repairLogin(); }, []);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || {
    username: 'yagmurrrrrr', fullName: 'Yağmur Yılmaz', phone: '0555 555 55 55', address: 'Beşiktaş, İstanbul', email: 'yagmur@track.com', password: '123', job: 'Yazılım Geliştirici', birthDate: '1995-01-01', gender: 'Kadın'
  });

  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('trans_data')) || []);
  const [wallet, setWallet] = useState(() => JSON.parse(localStorage.getItem('wallet_data')) || { bakiye: 100000, dolar: 1000, euro: 500, altin: 10 });
  const [limits, setLimits] = useState(() => JSON.parse(localStorage.getItem('limits_data')) || { 
    gida: 5000, kira: 15000, ulasim: 2000, teknoloji: 10000, eglence: 3000, fatura: 4000
  });

  const [rates] = useState({ dolar: 43.15, euro: 50.45, altin: 6150.20 });
  const [formData, setFormData] = useState({ desc: '', amt: '', cat: 'gida' });

  useEffect(() => {
    localStorage.setItem('trans_data', JSON.stringify(transactions));
    localStorage.setItem('wallet_data', JSON.stringify(wallet));
    localStorage.setItem('limits_data', JSON.stringify(limits));
    localStorage.setItem('user_profile', JSON.stringify(user));
  }, [transactions, wallet, limits, user]);

  const t = TEXTS[lang];

  const handleLogin = () => {
    if (loginData.user.trim() === "yagmurrrrrr" && loginData.pass.trim() === "123") setIsLoggedIn(true);
    else alert(lang === 'tr' ? "Giriş başarısız!" : "Login failed!");
  };

  const handleSave = () => {
    const val = parseFloat(formData.amt);
    if (!val) return;
    const final = modalType === 'gelir' ? val : -val;
    const now = new Date();
    const dateStr = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    setTransactions([{ id: Date.now(), desc: formData.desc, amount: final, cat: formData.cat, date: dateStr }, ...transactions]);
    setWallet({ ...wallet, bakiye: wallet.bakiye + final });
    playTrink(); // SES ÇAL
    setShowModal(false);
  };

  const deleteTransaction = (id, amount) => {
    setTransactions(transactions.filter(tr => tr.id !== id));
    setWallet({ ...wallet, bakiye: wallet.bakiye - amount });
  };

  const handleTrade = (asset, type) => {
    const amount = parseFloat(tradeAmounts[asset]);
    if (!amount || amount <= 0) return;
    const totalCost = rates[asset] * amount;
    if (type === 'al') {
      if (wallet.bakiye >= totalCost) {
        setWallet({ ...wallet, bakiye: wallet.bakiye - totalCost, [asset]: wallet[asset] + amount });
        setTransactions([{ id: Date.now(), desc: `${asset.toUpperCase()} Alım`, amount: -totalCost, cat: 'yatirim', date: 'Bugün' }, ...transactions]);
        playTrink(); // SES ÇAL
      } else alert(lang === 'tr' ? "Yetersiz Bakiye!" : "Insufficient Balance!");
    } else {
      if (wallet[asset] >= amount) {
        setWallet({ ...wallet, bakiye: wallet.bakiye + totalCost, [asset]: wallet[asset] - amount });
        setTransactions([{ id: Date.now(), desc: `${asset.toUpperCase()} Satış`, amount: totalCost, cat: 'yatirim', date: 'Bugün' }, ...transactions]);
        playTrink(); // SES ÇAL
      } else alert(lang === 'tr' ? "Yetersiz Varlık!" : "Insufficient Assets!");
    }
  };

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#1e293b',
    border: isDarkMode ? '#334155' : '#cbd5e1',
    accent: '#00d1ff'
  };

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', textAlign: 'center' }}>
          <h1 style={{ color: theme.accent }}>FIN-TRACK</h1>
          <input style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: '#fff' }} placeholder="Username" value={loginData.user} onChange={e => setLoginData({ ...loginData, user: e.target.value })} />
          <input type="password" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: '#fff' }} placeholder="Password" value={loginData.pass} onChange={e => setLoginData({ ...loginData, pass: e.target.value })} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: theme.accent, border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>GİRİŞ YAP</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif', margin: 0, overflow: 'hidden' }}>
      
      {/* SOL SIDEBAR */}
      <div style={{ width: '320px', background: '#0a0f1c', padding: '25px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: theme.accent, letterSpacing: '2px', marginBottom: '20px' }}>FIN-TRACK</h2>
        <nav style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ width: '100%', padding: '15px', marginBottom: '8px', background: activeTab === 'dashboard' ? theme.accent : 'transparent', color: activeTab === 'dashboard' ? '#000' : '#888', border: 'none', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{t.dashboard}</button>
          <button onClick={() => setActiveTab('transactions')} style={{ width: '100%', padding: '15px', marginBottom: '8px', background: activeTab === 'transactions' ? theme.accent : 'transparent', color: activeTab === 'transactions' ? '#000' : '#888', border: 'none', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{t.transactions}</button>
          <button onClick={() => setActiveTab('invest')} style={{ width: '100%', padding: '15px', marginBottom: '8px', background: activeTab === 'invest' ? theme.accent : 'transparent', color: activeTab === 'invest' ? '#000' : '#888', border: 'none', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{t.invest}</button>
          <button onClick={() => setActiveTab('profile')} style={{ width: '100%', padding: '15px', marginBottom: '8px', background: activeTab === 'profile' ? theme.accent : 'transparent', color: activeTab === 'profile' ? '#000' : '#888', border: 'none', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{t.profile}</button>
        </nav>

        <div style={{ background: '#161b22', padding: '15px', borderRadius: '15px', marginBottom: '15px', overflowY: 'auto', maxHeight: '300px' }}>
          <p style={{ fontSize: '11px', color: theme.accent, fontWeight: 'bold', marginBottom: '10px' }}>{t.limits}</p>
          {Object.keys(limits).map(cat => (
            <div key={cat} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#888' }}>{t[cat]?.toUpperCase() || cat.toUpperCase()}</span>
              <input type="number" style={{ width: '70px', padding: '5px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '11px' }} value={limits[cat]} onChange={e => setLimits({ ...limits, [cat]: e.target.value })} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '15px' }}>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#161b22', color: '#fff', border: '1px solid #333', cursor: 'pointer' }}>🌐 {lang.toUpperCase()}</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#161b22', color: '#fff', border: '1px solid #333', cursor: 'pointer' }}>🌗</button>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🚪 {t.logout}</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '45px', background: '#000', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'inline-block', animation: 'marquee 35s linear infinite' }}>
            {[`USD: ${rates.dolar}₺`, `EUR: ${rates.euro}₺`, `GOLD: ${rates.altin}₺`].map((rate, i) => (
              <span key={i} style={{ margin: '0 25px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>● LIVE</span> {rate}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: '25px 40px', background: theme.card, borderBottom: `1px solid ${theme.border}` }}>
          <h2 style={{ margin: 0 }}>{t.welcome}, {user.fullName} 👋</h2>
          <p style={{ color: '#f59e0b', fontSize: '14px', fontStyle: 'italic', marginTop: '8px' }}>
            "{MOTIVATION[Math.floor(Date.now() / 86400000) % MOTIVATION.length]}"
          </p>
        </div>

        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ background: theme.card, padding: '30px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
                  <p style={{ color: '#888', fontWeight: 'bold' }}>{t.totalBalance}</p>
                  <h1 style={{ fontSize: '56px', margin: '10px 0', color: theme.accent }}>{wallet.bakiye.toLocaleString()} ₺</h1>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => { setModalType('gelir'); setFormData({...formData, cat:'maas'}); setShowModal(true); }} style={{ padding: '15px 35px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>{t.income}</button>
                    <button onClick={() => { setModalType('gider'); setFormData({...formData, cat:'gida'}); setShowModal(true); }} style={{ padding: '15px 35px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>{t.expense}</button>
                  </div>
                </div>
                
                <div style={{ background: theme.card, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
                  <h3>{t.assets}</h3>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
                    {['dolar', 'euro', 'altin'].map(asset => (
                      <div key={asset} style={{ padding: '15px', background: '#161b22', borderRadius: '15px', textAlign:'center' }}>
                        <span style={{fontSize:'20px'}}>{asset === 'dolar' ? '💵' : asset === 'euro' ? '💶' : '🟡'}</span>
                        <p style={{margin:'5px 0 0 0', fontSize:'12px', color:'#888'}}>{asset.toUpperCase()}</p>
                        <b>{wallet[asset]}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: theme.card, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
                <h3 style={{marginTop:0}}>{t.limitStatus}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.keys(limits).map(cat => {
                    const spent = Math.abs(transactions.filter(tr => tr.cat === cat && tr.amount < 0).reduce((a, b) => a + b.amount, 0));
                    const limit = limits[cat];
                    const percent = Math.min((spent / limit) * 100, 100);
                    const isOver = spent >= limit;
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{fontWeight:'bold'}}>{t[cat]}</span>
                          <span style={{color: isOver ? '#ef4444' : '#888'}}>{spent.toLocaleString()} / {limit.toLocaleString()} ₺</span>
                        </div>
                        <div style={{ height: '12px', background: '#161b22', borderRadius: '10px', overflow: 'hidden', border:'1px solid #333' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: isOver ? 'linear-gradient(90deg, #ef4444, #ff0000)' : `linear-gradient(90deg, ${theme.accent}, #0088ff)`, transition: 'width 0.5s ease-in-out' }}></div>
                        </div>
                        {isOver && <small style={{color:'#ef4444', fontSize:'10px'}}>⚠️ Limit Aşıldı!</small>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <h3 style={{ color: '#10b981' }}>{t.historyIn}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: theme.text }}>
                  <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #333', fontSize: '13px' }}><th style={{ padding: '10px' }}>{t.desc}</th><th>{t.amt}</th><th>{t.date}</th><th></th></tr></thead>
                  <tbody>{transactions.filter(tr => tr.amount > 0).map(tr => (
                    <tr key={tr.id} style={{ borderBottom: '1px solid #161b22', fontSize: '14px' }}><td style={{ padding: '12px' }}>{tr.desc} <br/><small style={{color:'#888'}}>{t[tr.cat]}</small></td><td style={{ color: '#10b981' }}>+{tr.amount}₺</td><td style={{ fontSize: '11px', color: '#888' }}>{tr.date}</td><td><button onClick={() => deleteTransaction(tr.id, tr.amount)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button></td></tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                <h3 style={{ color: '#ef4444' }}>{t.historyOut}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: theme.text }}>
                  <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #333', fontSize: '13px' }}><th style={{ padding: '10px' }}>{t.desc}</th><th>{t.amt}</th><th>{t.date}</th><th></th></tr></thead>
                  <tbody>{transactions.filter(tr => tr.amount < 0).map(tr => (
                    <tr key={tr.id} style={{ borderBottom: '1px solid #161b22', fontSize: '14px' }}><td style={{ padding: '12px' }}>{tr.desc} <br/><small style={{color:'#888'}}>{t[tr.cat]}</small></td><td style={{ color: '#ef4444' }}>{tr.amount}₺</td><td style={{ fontSize: '11px', color: '#888' }}>{tr.date}</td><td><button onClick={() => deleteTransaction(tr.id, tr.amount)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button></td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'invest' && (
            <div style={{ background: theme.card, padding: '30px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
              <h3>{t.tradeTitle}</h3>
              <p>{t.tradeBalance}: <b style={{color:theme.accent}}>{wallet.bakiye.toLocaleString()} ₺</b></p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {['dolar', 'euro', 'altin'].map(asset => (
                  <div key={asset} style={{ padding: '20px', background: '#161b22', borderRadius: '20px', textAlign: 'center' }}>
                    <h4>{asset.toUpperCase()}</h4>
                    <p style={{ color: theme.accent, fontSize: '22px' }}>{rates[asset]} ₺</p>
                    <input type="number" style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} value={tradeAmounts[asset]} onChange={e => setTradeAmounts({ ...tradeAmounts, [asset]: e.target.value })} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleTrade(asset, 'al')} style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff' }}>{t.buy}</button>
                      <button onClick={() => handleTrade(asset, 'sat')} style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff' }}>{t.sell}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px', background: theme.card, padding: '30px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
              <h3>{t.profile}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={{fontSize:'12px', color:'#888'}}>AD SOYAD</label><input style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius:'8px' }} value={user.fullName} onChange={e => setUser({ ...user, fullName: e.target.value })} /></div>
                <div><label style={{fontSize:'12px', color:'#888'}}>E-POSTA</label><input style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius:'8px' }} value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} /></div>
                <div><label style={{fontSize:'12px', color:'#888'}}>MESLEK</label><input style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius:'8px' }} value={user.job} onChange={e => setUser({ ...user, job: e.target.value })} /></div>
                <div><label style={{fontSize:'12px', color:'#888'}}>CİNSİYET</label><select style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius:'8px' }} value={user.gender} onChange={e => setUser({ ...user, gender: e.target.value })}><option value="Kadın">Kadın</option><option value="Erkek">Erkek</option></select></div>
                <div style={{gridColumn:'span 2'}}><label style={{fontSize:'12px', color:'#888'}}>ADRES</label><textarea style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius:'8px', height:'60px' }} value={user.address} onChange={e => setUser({ ...user, address: e.target.value })} /></div>
              </div>
              <button style={{ width: '100%', padding: '15px', background: theme.accent, color: '#000', border: 'none', fontWeight: 'bold', borderRadius:'12px', marginTop:'20px' }} onClick={() => alert("Güncellendi!")}>{t.update}</button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', padding: '30px', borderRadius: '25px', width: '350px', border: `1px solid ${theme.accent}` }}>
            <h3 style={{marginTop:0}}>{modalType === 'gelir' ? t.income : t.expense}</h3>
            <input style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing:'border-box' }} placeholder={t.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
            <input style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing:'border-box' }} placeholder={t.amt} type="number" onChange={e => setFormData({ ...formData, amt: e.target.value })} />
            <select style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius:'8px' }} value={formData.cat} onChange={e => setFormData({ ...formData, cat: e.target.value })}>
              {modalType === 'gelir' ? (
                <><option value="maas">{t.maas}</option><option value="yan_gelir">{t.yan_gelir}</option><option value="prim">{t.prim}</option></>
              ) : (
                <><option value="gida">{t.gida}</option><option value="kira">{t.kira}</option><option value="ulasim">{t.ulasim}</option><option value="teknoloji">{t.teknoloji}</option><option value="eglence">{t.eglence}</option><option value="fatura">{t.fatura}</option></>
              )}
            </select>
            <button onClick={handleSave} style={{ width: '100%', padding: '12px', background: theme.accent, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor:'pointer' }}>{t.save}</button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', background: 'none', color: '#888', border: 'none', marginTop: '10px', cursor:'pointer' }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        body { margin: 0; padding: 0; background: #0f172a; }
      `}</style>
    </div>
  );
}

export default App;