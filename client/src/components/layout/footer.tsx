import { Link } from 'wouter';
import { FaTelegramPlane, FaInstagram, FaFacebook, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useTranslation, type Language } from '@/lib/i18n';

interface FooterProps {
  language: Language;
}

export function Footer({ language }: FooterProps) {
  const { t } = useTranslation(language);

  return (
    <footer className="bg-card border-t border-border py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold gradient-text mb-4">ElectroIsrael</div>
            <p className="text-muted-foreground text-sm mb-4">
              Premium vaping and tobacco products in Israel. Cash payment on delivery.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://t.me/Dark090111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                data-testid="link-telegram"
              >
                <FaTelegramPlane />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-facebook">
                <FaFacebook />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalog?category=vapes" className="hover:text-foreground transition-colors" data-testid="link-footer-vapes">
                  {t('electronicVapes')}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=tobacco" className="hover:text-foreground transition-colors" data-testid="link-footer-tobacco">
                  {t('premiumTobacco')}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=accessories" className="hover:text-foreground transition-colors" data-testid="link-footer-accessories">
                  {t('vapeAccessories')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://t.me/Dark090111" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" data-testid="link-contact">
                  Contact Us
                </a>
              </li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-shipping">Shipping Info</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-returns">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <FaTelegramPlane className="mr-2" />
                <span data-testid="text-telegram-handle">@Dark090111</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span data-testid="text-delivery-area">{t('israelDelivery')}</span>
              </li>
              <li className="flex items-center">
                <FaMoneyBillWave className="mr-2" />
                <span data-testid="text-payment-method">{t('cashPaymentOnly')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">&copy; 2024 ElectroIsrael. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
