import { Button, Input } from './ui.jsx';

export default function AuthScreen({
  t, isDarkMode,
  authView, setAuthView,
  loginData, setLoginData, handleLogin, loginLoading,
  registerData, setRegisterData, handleRegister, registerLoading,
  forgotStep, setForgotStep, forgotData, setForgotData,
  handleForgotVerify, verifyLoading, handleForgotReset, resetLoading
}) {
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: fadeInUp 0.5s ease-out; }
      `}</style>

      <div className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-slate-200 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/10" />

        <div className="auth-card relative w-full max-w-sm rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-2xl shadow-lg shadow-cyan-500/30">
              💰
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-cyan-600 dark:text-cyan-400">{t.appName}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {authView === 'login' && t.appTagline}
              {authView === 'register' && t.registerTitle}
              {authView === 'forgot' && t.forgotTitle}
            </p>
          </div>

          {/* Her görünüm artık gerçek bir <form onSubmit>: Enter tuşuyla gönderim çalışır (önceden
              butonlar sadece onClick'e bağlıydı, klavyeyle şifre alanında Enter'a basmak hiçbir şey
              yapmıyordu). autoComplete öznitelikleri şifre yöneticilerinin alanları doğru tanımasını sağlar. */}
          {authView === 'login' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
              <Input
                label={t.usernameLabel}
                autoComplete="username"
                value={loginData.user}
                onChange={e => setLoginData({ ...loginData, user: e.target.value })}
              />
              <Input
                label={t.passwordLabel}
                type="password"
                autoComplete="current-password"
                value={loginData.pass}
                onChange={e => setLoginData({ ...loginData, pass: e.target.value })}
              />
              <Button type="submit" className="w-full" loading={loginLoading}>{t.loginTitle}</Button>
              <div className="space-y-2 pt-2 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setAuthView('forgot')}
                  className="block w-full text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  {t.forgotPassword}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthView('register')}
                  className="block w-full text-slate-500 hover:underline dark:text-slate-400"
                >
                  {t.noAccount}
                </button>
              </div>
            </form>
          )}

          {authView === 'register' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
              <Input
                label={t.fullNameLabel}
                autoComplete="name"
                value={registerData.fullName}
                onChange={e => setRegisterData({ ...registerData, fullName: e.target.value })}
              />
              <Input
                label={t.usernameLabel}
                autoComplete="username"
                value={registerData.username}
                onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
              />
              <Input
                label={t.passwordLabel}
                type="password"
                autoComplete="new-password"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <Input
                label={t.confirmPasswordLabel}
                type="password"
                autoComplete="new-password"
                value={registerData.confirm}
                onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })}
              />
              <Input
                label={t.securityQuestion}
                value={registerData.securityAnswer}
                onChange={e => setRegisterData({ ...registerData, securityAnswer: e.target.value })}
              />
              <Button type="submit" className="w-full" loading={registerLoading}>{t.registerTitle}</Button>
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="block w-full pt-2 text-center text-sm text-slate-500 hover:underline dark:text-slate-400"
              >
                {t.haveAccount}
              </button>
            </form>
          )}

          {authView === 'forgot' && (
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                if (forgotStep === 1) handleForgotVerify();
                else handleForgotReset();
              }}
            >
              {forgotStep === 1 ? (
                <>
                  <Input
                    label={t.usernameLabel}
                    autoComplete="username"
                    value={forgotData.username}
                    onChange={e => setForgotData({ ...forgotData, username: e.target.value })}
                  />
                  <Input
                    label={t.securityQuestion}
                    value={forgotData.securityAnswer}
                    onChange={e => setForgotData({ ...forgotData, securityAnswer: e.target.value })}
                  />
                  <Button type="submit" className="w-full" loading={verifyLoading}>{t.verifyBtn}</Button>
                </>
              ) : (
                <>
                  <Input
                    label={t.newPasswordLabel}
                    type="password"
                    autoComplete="new-password"
                    value={forgotData.newPassword}
                    onChange={e => setForgotData({ ...forgotData, newPassword: e.target.value })}
                  />
                  <Input
                    label={t.confirmNewPasswordLabel}
                    type="password"
                    autoComplete="new-password"
                    value={forgotData.confirm}
                    onChange={e => setForgotData({ ...forgotData, confirm: e.target.value })}
                  />
                  <Button type="submit" className="w-full" loading={resetLoading}>{t.resetPasswordBtn}</Button>
                </>
              )}
              <button
                type="button"
                onClick={() => { setAuthView('login'); setForgotStep(1); }}
                className="block w-full pt-2 text-center text-sm text-slate-500 hover:underline dark:text-slate-400"
              >
                {t.backToLogin}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}