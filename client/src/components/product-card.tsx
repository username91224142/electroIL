import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductWithCategory } from '@shared/schema';
import { useTranslation, type Language } from '@/lib/i18n';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: ProductWithCategory;
  language: Language;
}

export function ProductCard({ product, language }: ProductCardProps) {
  const { t } = useTranslation(language);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product.stock !== null && product.stock !== undefined && product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const getLocalizedName = () => {
    switch (language) {
      case 'ru':
        return product.nameRu || product.name;
      case 'he':
        return product.nameHe || product.name;
      default:
        return product.name;
    }
  };

  const getLocalizedDescription = () => {
    switch (language) {
      case 'ru':
        return product.descriptionRu || product.description;
      case 'he':
        return product.descriptionHe || product.description;
      default:
        return product.description;
    }
  };

  return (
    <Card className="bg-card rounded-xl overflow-hidden hover-lift" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={getLocalizedName()}
            className="w-full h-48 object-cover"
            data-testid={`img-product-${product.id}`}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground" data-testid={`placeholder-product-${product.id}`}>No Image</span>
          </div>
        )}
        {product.stock !== null && product.stock !== undefined && product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold" data-testid={`text-out-of-stock-${product.id}`}>
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>
          {getLocalizedName()}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
          {getLocalizedDescription()}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ₪{parseFloat(product.price).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock !== null && product.stock !== undefined && product.stock <= 0}
            className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium hover:opacity-90 transition-opacity"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {t('addToCart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
