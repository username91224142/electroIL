import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { useTranslation, type Language } from '@/lib/i18n';
import { useCart } from '@/hooks/use-cart';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const { t } = useTranslation(language);
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="nav-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <div className="text-2xl font-bold gradient-text">ElectroIsrael</div>
            <span className="ml-2 text-sm text-muted-foreground">IL</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/catalog" className="text-foreground hover:text-primary transition-colors" data-testid="link-catalog">
              {t('catalog')}
            </Link>
            <Link href="/catalog?category=vapes" className="text-foreground hover:text-primary transition-colors" data-testid="link-vapes">
              {t('vapes')}
            </Link>
            <Link href="/catalog?category=tobacco" className="text-foreground hover:text-primary transition-colors" data-testid="link-tobacco">
              {t('tobacco')}
            </Link>
            <Link href="/catalog?category=accessories" className="text-foreground hover:text-primary transition-colors" data-testid="link-accessories">
              {t('accessories')}
            </Link>
          </div>

          {/* Language & Cart */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" className="relative p-2 text-foreground hover:text-primary transition-colors" data-testid="button-cart">
                <FaShoppingCart className="text-lg" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center" data-testid="text-cart-count">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <FaBars />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border" data-testid="menu-mobile">
            <Link href="/catalog" className="block text-foreground hover:text-primary transition-colors" data-testid="link-mobile-catalog">
              {t('catalog')}
            </Link>
            <Link href="/catalog?category=vapes" className="block text-foreground hover:text-primary transition-colors" data-testid="link-mobile-vapes">
              {t('vapes')}
            </Link>
            <Link href="/catalog?category=tobacco" className="block text-foreground hover:text-primary transition-colors" data-testid="link-mobile-tobacco">
              {t('tobacco')}
            </Link>
            <Link href="/catalog?category=accessories" className="block text-foreground hover:text-primary transition-colors" data-testid="link-mobile-accessories">
              {t('accessories')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
