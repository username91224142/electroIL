import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaTrash, FaTelegramPlane, FaMoneyBillWave } from 'react-icons/fa';
import { useCart } from '@/hooks/use-cart';
import { useTranslation, type Language } from '@/lib/i18n';

interface CartProps {
  language: Language;
}

export default function Cart({ language }: CartProps) {
  const { t } = useTranslation(language);
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16" data-testid="page-cart-empty">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8" data-testid="text-cart-title">{t('shoppingCart')}</h2>
            <p className="text-muted-foreground mb-8" data-testid="text-cart-empty">Your cart is empty</p>
            <Link href="/catalog">
              <Button className="bg-primary text-primary-foreground px-8 py-3 font-semibold" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16" data-testid="page-cart">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8" data-testid="text-cart-title">{t('shoppingCart')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2" data-testid="section-cart-items">
            {items.map((item) => (
              <Card key={item.product.id} className="bg-card p-6 rounded-xl mb-4" data-testid={`card-cart-item-${item.product.id}`}>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-cart-item-${item.product.id}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid={`text-cart-item-name-${item.product.id}`}>
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-description-${item.product.id}`}>
                        {item.product.description.slice(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                            data-testid={`button-decrease-${item.product.id}`}
                          >
                            -
                          </Button>
                          <span className="min-w-[2rem] text-center" data-testid={`text-quantity-${item.product.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                            data-testid={`button-increase-${item.product.id}`}
                          >
                            +
                          </Button>
                        </div>
                        <span className="font-semibold text-primary" data-testid={`text-cart-item-price-${item.product.id}`}>
                          ₪{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:text-destructive/80 p-2"
                      data-testid={`button-remove-${item.product.id}`}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Contact Manager */}
            <Card className="bg-primary/10 border border-primary/20 p-6 rounded-xl" data-testid="card-contact-manager">
              <CardContent className="p-0">
                <h3 className="font-semibold text-primary mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our manager for assistance with your order
                </p>
                <a href="https://t.me/Dark090111" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity" data-testid="button-contact-telegram">
                    <FaTelegramPlane className="mr-2" />
                    Message @Dark090111
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card p-6 rounded-xl sticky top-24" data-testid="card-order-summary">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span data-testid="text-subtotal-label">{t('subtotal')}</span>
                    <span data-testid="text-subtotal-amount">₪{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span data-testid="text-delivery-label">{t('delivery')}</span>
                    <span data-testid="text-delivery-amount">₪{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span data-testid="text-total-label">{t('total')}</span>
                      <span className="text-primary" data-testid="text-total-amount">₪{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mb-6" data-testid="card-payment-info">
                  <div className="flex items-center space-x-2 text-sm">
                    <FaMoneyBillWave className="text-primary" />
                    <span>{t('cashPayment')}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 transition-opacity" data-testid="button-proceed-checkout">
                    {t('proceedToCheckout')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
