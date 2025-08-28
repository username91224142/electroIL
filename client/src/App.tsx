import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TelegramButton } from "@/components/telegram-button";
import { type Language } from "@/lib/i18n";

// Pages
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import Product from "@/pages/product";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminProducts from "@/pages/admin/products";
import NotFound from "@/pages/not-found";

// Admin route guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const isAuthenticated = localStorage.getItem('admin-authenticated') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  const [language, setLanguage] = useState<Language>('en');
  const [location] = useLocation();
  
  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ru', 'he'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage and apply RTL
  useEffect(() => {
    localStorage.setItem('language', language);
    if (language === 'he') {
      document.body.classList.add('rtl');
      document.documentElement.dir = 'rtl';
    } else {
      document.body.classList.remove('rtl');
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const isAdminRoute = location.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAdminRoute && (
        <Header language={language} onLanguageChange={handleLanguageChange} />
      )}
      
      <main className={!isAdminRoute ? 'min-h-screen' : ''}>
        <Switch>
          {/* Public routes */}
          <Route path="/" component={() => <Home language={language} />} />
          <Route path="/catalog" component={() => <Catalog language={language} />} />
          <Route path="/product/:id" component={({ params }) => <Product id={params.id} language={language} />} />
          <Route path="/cart" component={() => <Cart language={language} />} />
          <Route path="/checkout" component={() => <Checkout language={language} />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={() => (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          )} />
          <Route path="/admin/orders" component={() => (
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          )} />
          <Route path="/admin/products" component={() => (
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          )} />
          
          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {!isAdminRoute && (
        <>
          <Footer language={language} />
          <TelegramButton />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
