export const USERS_KEY = 'fintrack_users';

// Kayıtlı kullanıcıları getirir, hiç yoksa demo kullanıcıyı oluşturur
export function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* bozuksa yeniden oluştur */ }
  }
  const seed = {
    yagmurrrrrr: {
      password: '123', fullName: 'Yağmur Yılmaz', phone: '0555 555 55 55',
      address: 'Beşiktaş, İstanbul', email: 'yagmur@track.com', job: 'Yazılım Geliştirici',
      birthDate: '1995-01-01', gender: 'Kadın', securityAnswer: 'yagmur'
    }
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function userDataKey(username, kind) {
  return `${kind}_${username}`;
}

export const MOTIVATION = {
  tr: [
    "Bugünün tasarrufu, yarının özgürlüğüdür.",
    "Paranı kontrol et, yoksa o seni kontrol eder.",
    "Zenginlik, kazandığından daha azını harcamaktır.",
    "Finansal özgürlük bir varış noktası değil, bir yolculuktur."
  ],
  en: [
    "Today's savings are tomorrow's freedom.",
    "Control your money, or it will control you.",
    "Wealth is spending less than you earn.",
    "Financial freedom is a journey, not a destination."
  ]
};

export const TEXTS = {
  tr: {
    dashboard: "Dashboard", transactions: "İşlemler", invest: "Döviz Al/Sat", profile: "Profil",
    limits: "LİMİT AYARLARI", logout: "Çıkış Yap", welcome: "Hoş Geldiniz", totalBalance: "GÜNCEL TL BAKİYE",
    income: "Gelir Ekle", expense: "Gider Ekle", limitStatus: "Harcama & Limit Durumu", assets: "Varlık Detayları",
    tradeTitle: "Döviz ve Altın Ticareti", tradeBalance: "Bakiyeniz", buy: "Al", sell: "Sat",
    save: "Kaydet", cancel: "Vazgeç", historyIn: "Gelir Geçmişi", historyOut: "Gider Geçmişi",
    tradeHistory: "Döviz / Altın İşlemleri",
    desc: "Açıklama", amt: "Tutar", cat: "Kategori", update: "Bilgileri Kaydet", date: "Tarih",
    maas: "Maaş", yan_gelir: "Yan Gelir", prim: "Prim", faiz: "Faiz/Borsa", hediye: "Hediye",
    gida: "Gıda", kira: "Kira", ulasim: "Ulaşım", teknoloji: "Teknoloji", eglence: "Eğlence",
    saglik: "Sağlık", fatura: "Faturalar", giyim: "Giyim", egitim: "Eğitim", diger: "Diğer",
    yatirim: "Yatırım",
    analytics: "Analiz", catBreakdown: "Kategori Bazlı Harcama Dağılımı", monthlyTrend: "Aylık Gelir / Gider Trendi",
    assetAllocation: "Varlık Dağılımı (₺ Karşılığı)", noData: "Henüz veri yok.", incomeLbl: "Gelir", expenseLbl: "Gider", netWorth: "TOPLAM NET DEĞER",
    lastUpdate: "Son güncelleme",
    loginTitle: "Giriş Yap", registerTitle: "Kayıt Ol", fullNameLabel: "Ad Soyad", usernameLabel: "Kullanıcı Adı",
    passwordLabel: "Şifre", confirmPasswordLabel: "Şifre (Tekrar)",
    securityQuestion: "Güvenlik Sorusu: İlk evcil hayvanınızın adı?", securityAnswerLabel: "Cevap",
    haveAccount: "Zaten hesabın var mı? Giriş yap", noAccount: "Hesabın yok mu? Kayıt ol",
    forgotPassword: "Şifremi Unuttum", forgotTitle: "Şifremi Unuttum", verifyBtn: "Doğrula",
    newPasswordLabel: "Yeni Şifre", confirmNewPasswordLabel: "Yeni Şifre (Tekrar)", resetPasswordBtn: "Şifreyi Sıfırla",
    backToLogin: "Girişe Dön", changePassword: "Şifre Değiştir", changePasswordTitle: "Şifre Değiştir",
    currentPasswordLabel: "Mevcut Şifre", updatePasswordBtn: "Şifreyi Güncelle",
    errUsernameTaken: "Bu kullanıcı adı zaten alınmış.", errPasswordMismatch: "Şifreler eşleşmiyor.",
    errPasswordTooShort: "Şifre en az 3 karakter olmalı.", errUserNotFound: "Kullanıcı bulunamadı.",
    errWrongAnswer: "Güvenlik sorusu cevabı yanlış.", errWrongCurrentPassword: "Mevcut şifre yanlış.",
    registerSuccess: "Kayıt başarılı! Şimdi giriş yapabilirsin.", passwordResetSuccess: "Şifren güncellendi, giriş yapabilirsin.",
    passwordUpdated: "Şifre güncellendi!", fillAllFields: "Lütfen tüm alanları doldurun.", updated: "Güncellendi!",
    appName: "FIN-TRACK", appTagline: "Kişisel finans takibi",
    emptyIncomeTitle: "Henüz gelir yok", emptyIncomeHint: "İlk gelirini ekleyerek bakiyeni büyütmeye başla.",
    emptyExpenseTitle: "Henüz gider yok", emptyExpenseHint: "Harcamalarını eklemeye başladığında burada görünecek.",
    emptyTradeTitle: "Henüz işlem yapmadın", emptyTradeHint: "Döviz veya altın alıp sattığında geçmişin burada birikecek.",
    emptyAnalyticsTitle: "Henüz analiz edilecek veri yok", emptyAnalyticsHint: "Birkaç işlem ekle, grafikler burada otomatik oluşsun.",
    emptyInvestHint: "Henüz yatırımın yok — ilk alımını yaparak başla 🚀",
    emptyProfileHint: "Profilini tamamla — bilgilerini ekleyerek hesabını kişiselleştir.",
    dashboardWelcomeTitle: "Finansal yolculuğuna hoş geldin 👋",
    dashboardWelcomeHint: "İlk gelir ya da giderini ekleyerek panoyu keşfetmeye başla.",
    txSavedSuccess: "İşlem kaydedildi!", tradeSuccess: "İşlem başarıyla tamamlandı!",
    recentTransactions: "Son İşlemler", viewAll: "Tümünü Gör"
  },
  en: {
    dashboard: "Dashboard", transactions: "Transactions", invest: "Trade", profile: "Profile",
    limits: "LIMIT SETTINGS", logout: "Log Out", welcome: "Welcome", totalBalance: "TOTAL TL BALANCE",
    income: "Add Income", expense: "Add Expense", limitStatus: "Spending & Limit Status", assets: "Asset Details",
    tradeTitle: "Currency & Gold Trade", tradeBalance: "Your Balance", buy: "Buy", sell: "Sell",
    save: "Save", cancel: "Cancel", historyIn: "Income History", historyOut: "Expense History",
    tradeHistory: "Currency / Gold Transactions",
    desc: "Description", amt: "Amount", cat: "Category", update: "Save Changes", date: "Date",
    maas: "Salary", yan_gelir: "Side Income", prim: "Bonus", faiz: "Interest/Stock", hediye: "Gift",
    gida: "Food", kira: "Rent", ulasim: "Transport", teknoloji: "Tech", eglence: "Fun",
    saglik: "Health", fatura: "Bills", giyim: "Clothing", egitim: "Education", diger: "Other",
    yatirim: "Investment",
    analytics: "Analytics", catBreakdown: "Expense Breakdown by Category", monthlyTrend: "Monthly Income / Expense Trend",
    assetAllocation: "Asset Allocation (₺ Value)", noData: "No data yet.", incomeLbl: "Income", expenseLbl: "Expense", netWorth: "TOTAL NET WORTH",
    lastUpdate: "Last update",
    loginTitle: "Log In", registerTitle: "Register", fullNameLabel: "Full Name", usernameLabel: "Username",
    passwordLabel: "Password", confirmPasswordLabel: "Confirm Password",
    securityQuestion: "Security question: What was your first pet's name?", securityAnswerLabel: "Answer",
    haveAccount: "Already have an account? Log in", noAccount: "Don't have an account? Register",
    forgotPassword: "Forgot Password", forgotTitle: "Forgot Password", verifyBtn: "Verify",
    newPasswordLabel: "New Password", confirmNewPasswordLabel: "Confirm New Password", resetPasswordBtn: "Reset Password",
    backToLogin: "Back to Login", changePassword: "Change Password", changePasswordTitle: "Change Password",
    currentPasswordLabel: "Current Password", updatePasswordBtn: "Update Password",
    errUsernameTaken: "This username is already taken.", errPasswordMismatch: "Passwords don't match.",
    errPasswordTooShort: "Password must be at least 3 characters.", errUserNotFound: "User not found.",
    errWrongAnswer: "Security answer is incorrect.", errWrongCurrentPassword: "Current password is incorrect.",
    registerSuccess: "Registered successfully! You can log in now.", passwordResetSuccess: "Password updated, you can log in now.",
    passwordUpdated: "Password updated!", fillAllFields: "Please fill in all fields.", updated: "Updated!",
    appName: "FIN-TRACK", appTagline: "Personal finance tracker",
    emptyIncomeTitle: "No income yet", emptyIncomeHint: "Add your first income to start growing your balance.",
    emptyExpenseTitle: "No expenses yet", emptyExpenseHint: "Your spending will show up here once you add some.",
    emptyTradeTitle: "No trades yet", emptyTradeHint: "Buy or sell currency and gold to build your trade history here.",
    emptyAnalyticsTitle: "Nothing to analyze yet", emptyAnalyticsHint: "Add a few transactions and your charts will fill in automatically.",
    emptyInvestHint: "No investments yet — make your first trade to get started 🚀",
    emptyProfileHint: "Complete your profile — add your details to personalize your account.",
    dashboardWelcomeTitle: "Welcome to your financial journey 👋",
    dashboardWelcomeHint: "Add your first income or expense to start exploring your dashboard.",
    txSavedSuccess: "Transaction saved!", tradeSuccess: "Trade completed successfully!",
    recentTransactions: "Recent Transactions", viewAll: "View All"
  }
};

export const PIE_COLORS = ['#0891b2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#22d3ee', '#84cc16', '#f97316', '#64748b'];

export function getDateStr() {
  const now = new Date();
  return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
}

// dd.mm.yyyy -> "yyyy-mm" anahtarı, sıralama için de kullanılır
export function monthKeyFromDate(dateStr) {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, '0')}`;
}

// Türkçe ondalık biçimini ("6.150,20" / "6150,20") sayıya çevirir
export function parseTrNumber(raw) {
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().replace(/\./g, '').replace(',', '.');
  const val = parseFloat(normalized);
  return Number.isFinite(val) ? val : null;
}