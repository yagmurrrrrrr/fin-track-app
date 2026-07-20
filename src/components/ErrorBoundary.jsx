import { Component } from 'react';
import { Card, Button } from './ui.jsx';

// React'in kendi hata mesajı önerdiği gibi (bu oturumda gerçek bir dosya-karışması hatasında
// tüm uygulama beyaz ekrana düşmüştü): tek bir bileşen render hatası verdiğinde artık tüm
// SPA çökmüyor, kullanıcı tanıdık kart tasarımıyla bir kurtarma ekranı görüyor.
// Business logic'e dokunmuyor — sadece render katmanını sarmalıyor.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Geliştirici konsolunda görünür kalsın, sessizce yutmuyoruz.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        <Card className="w-full max-w-sm text-center">
          <span className="text-3xl" aria-hidden="true">⚠️</span>
          <h1 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
            Bir şeyler ters gitti
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyebilirsin, verilerin güvende.
          </p>
          <Button className="mt-5 w-full" onClick={this.handleReload}>
            Sayfayı Yenile
          </Button>
        </Card>
      </div>
    );
  }
}